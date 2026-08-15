import type {
  View,
  Text as RNText,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';

export type SelectSize = 'sm' | 'md' | 'lg' | 'xl';
export type SelectVariant = 'outline' | 'filled' | 'underlined' | 'rounded';

export interface SelectOption {
  value: string;
  label: string;
}

export interface TriggerLayout {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
}

export interface SelectContextValue {
  isOpen: boolean;
  isMulti: boolean;
  selectedValue: string | null;
  selectedValues: string[];
  selectedLabel: string;
  selectedItems: SelectOption[];
  searchValue: string;
  placeholder: string;
  size: SelectSize;
  variant: SelectVariant;
  isDisabled: boolean;
  isInvalid: boolean;
  triggerLayout: TriggerLayout | null;
  selectedItemLayoutY: number | null;
  onOpen: () => void;
  onClose: () => void;
  onValueChange: (value: string, label: string) => void;
  onValueRemove: (value: string) => void;
  onSearchChange: (value: string) => void;
  isValueSelected: (value: string) => boolean;
  shouldShowItem: (value: string, label: string) => boolean;
  registerItem: (value: string, label: string) => void;
  registerItemLayout: (value: string, y: number) => void;
  setTriggerLayout: (layout: TriggerLayout) => void;
}

export interface SelectProps {
  className?: string;
  isMulti?: boolean;
  selectedValue?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  selectedValues?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  valueLabels?: Record<string, string>;
  closeOnSelect?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  filterOption?: (searchValue: string, option: SelectOption) => boolean;
  formatSelectedLabel?: (items: SelectOption[]) => string;
  size?: SelectSize;
  variant?: SelectVariant;
  isDisabled?: boolean;
  isInvalid?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Pressable> {
  className?: string;
}

export interface SelectInputProps
  extends React.ComponentPropsWithoutRef<typeof RNText> {
  className?: string;
  placeholder?: string;
}

export interface SelectIconProps {
  as?: React.ElementType;
  className?: string;
}

export interface SelectPortalProps {
  children: React.ReactNode;
}

export interface SelectBackdropProps
  extends React.ComponentPropsWithoutRef<typeof Pressable> {
  className?: string;
}

export interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
}

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof Pressable> {
  className?: string;
  label: string;
  value: string;
  isDisabled?: boolean;
}

export interface SelectItemTextProps
  extends React.ComponentPropsWithoutRef<typeof RNText> {
  className?: string;
}

export interface SelectSearchInputProps
  extends React.ComponentPropsWithoutRef<typeof TextInput> {
  className?: string;
  inputClassName?: string;
  clearButtonClassName?: string;
  clearLabel?: string;
  isClearable?: boolean;
}

export interface SelectSelectedBadgesProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
  badgeClassName?: string;
  badgeTextClassName?: string;
  badgeCloseButtonClassName?: string;
  maxVisible?: number;
  showRemoveButton?: boolean;
  overflowLabel?: (count: number) => string;
  renderBadge?: (
    item: SelectOption,
    helpers: { remove: () => void; isDisabled: boolean },
  ) => React.ReactNode;
}

export interface SelectDragIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string;
}

export interface SelectScrollViewProps
  extends React.ComponentPropsWithoutRef<typeof ScrollView> {
  className?: string;
}
