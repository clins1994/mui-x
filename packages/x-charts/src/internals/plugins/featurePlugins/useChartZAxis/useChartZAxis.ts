'use client';
import * as React from 'react';
import { MakeOptional } from '@mui/x-internals/types';
import { ChartPlugin } from '../../models';
import { DatasetType } from '../../../../models/seriesType/config';
import { UseChartZAxisSignature } from './useChartZAxis.types';
import { ZAxisConfig, ZAxisDefaultized } from '../../../../models/z-axis';
import { getColorScale, getOrdinalColorScale } from '../../../colorScale';

function addDefaultId(axisConfig: MakeOptional<ZAxisConfig, 'id'>, defaultId: string): ZAxisConfig {
  if (axisConfig.id !== undefined) {
    return axisConfig as ZAxisConfig;
  }
  return {
    id: defaultId,
    ...axisConfig,
  };
}

function processColorMap(axisConfig: ZAxisConfig) {
  if (!axisConfig.colorMap) {
    return axisConfig;
  }

  return {
    ...axisConfig,
    colorScale:
      axisConfig.colorMap.type === 'ordinal' && axisConfig.data
        ? getOrdinalColorScale({ values: axisConfig.data, ...axisConfig.colorMap })
        : getColorScale(
            axisConfig.colorMap.type === 'continuous'
              ? { min: axisConfig.min, max: axisConfig.max, ...axisConfig.colorMap }
              : axisConfig.colorMap,
          ),
  };
}

function getZAxisState(
  zAxis?: readonly MakeOptional<ZAxisConfig, 'id'>[],
  dataset?: Readonly<DatasetType>,
) {
  if (!zAxis || zAxis.length === 0) {
    return { axis: {}, axisIds: [] };
  }

  const zAxisLookup: Record<string, ZAxisDefaultized> = {};
  const axisIds: string[] = [];

  zAxis.forEach((axisConfig, index) => {
    const dataKey = axisConfig.dataKey;
    const defaultizedId = axisConfig.id ?? `defaultized-z-axis-${index}`;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      zAxisLookup[defaultizedId] = processColorMap(addDefaultId(axisConfig, defaultizedId));
      axisIds.push(defaultizedId);
      return;
    }
    if (dataset === undefined) {
      throw new Error('MUI X: z-axis uses `dataKey` but no `dataset` is provided.');
    }
    zAxisLookup[defaultizedId] = processColorMap(
      addDefaultId(
        {
          ...axisConfig,
          data: dataset.map((d) => d[dataKey]),
        },
        defaultizedId,
      ),
    );
    axisIds.push(defaultizedId);
  });

  return { axis: zAxisLookup, axisIds };
}

export const useChartZAxis: ChartPlugin<UseChartZAxisSignature> = ({ params, store }) => {
  const { zAxis, dataset } = params;

  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useChartZAxis`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    store.update((prev) => ({
      ...prev,
      zAxis: getZAxisState(zAxis, dataset),
    }));
  }, [zAxis, dataset, store]);

  return {};
};

useChartZAxis.params = {
  zAxis: true,
  dataset: true,
};

useChartZAxis.getInitialState = (params) => ({
  zAxis: getZAxisState(params.zAxis, params.dataset),
});
