import {
  BasePickerProps,
  UsePickerParameters,
  ExportedBaseToolbarProps,
  StaticOnlyPickerProps,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
} from '@mui/x-date-pickers/internals';
import {
  ExportedPickersLayoutSlots,
  ExportedPickersLayoutSlotProps,
} from '@mui/x-date-pickers/PickersLayout';
import { UseRangePositionProps } from '../useRangePosition';

export interface UseStaticRangePickerSlots extends ExportedPickersLayoutSlots<PickerRangeValue> {}

export interface UseStaticRangePickerSlotProps
  extends ExportedPickersLayoutSlotProps<PickerRangeValue> {
  toolbar?: ExportedBaseToolbarProps;
}

export interface StaticRangeOnlyPickerProps extends StaticOnlyPickerProps, UseRangePositionProps {}

export interface UseStaticRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UseStaticRangePickerProps<TView, any, TExternalProps>,
> extends BasePickerProps<PickerRangeValue, TView, TError, TExternalProps>,
    StaticRangeOnlyPickerProps {
  /**
   * Overridable components.
   * @default {}
   */
  slots?: UseStaticRangePickerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: UseStaticRangePickerSlotProps;
}

export interface UseStaticRangePickerParams<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseStaticRangePickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParameters<PickerRangeValue, TView, TExternalProps>,
    'valueManager' | 'valueType' | 'validator' | 'ref'
  > {
  props: TExternalProps;
}
