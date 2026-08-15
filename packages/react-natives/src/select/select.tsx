import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { View } from 'react-native';
import { useFormControlContext } from '../form-control/form-control';
import type {
  SelectProps,
  SelectContextValue,
  SelectSize,
  TriggerLayout,
  SelectOption,
} from './types';

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error(
      'Select compound components must be used within <Select>',
    );
  }
  return ctx;
}

export const Select = React.forwardRef<
  React.ElementRef<typeof View>,
  SelectProps
>(
  (
    {
      className,
      isMulti = false,
      selectedValue: controlledValue,
      defaultValue,
      onValueChange: onValueChangeProp,
      selectedValues: controlledValues,
      defaultValues = [],
      onValuesChange,
      valueLabels = {},
      closeOnSelect,
      searchValue: controlledSearchValue,
      defaultSearchValue = '',
      onSearchChange,
      filterOption,
      formatSelectedLabel,
      size = 'md',
      variant = 'outline',
      isDisabled: isDisabledProp,
      isInvalid: isInvalidProp,
      placeholder = 'Select...',
      children,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | null>(
      defaultValue ?? null,
    );
    const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
    const [internalLabel, setInternalLabel] = useState('');
    const [registeredLabels, setRegisteredLabels] =
      useState<Record<string, string>>({});
    const [itemLayouts, setItemLayouts] = useState<Record<string, number>>({});
    const [internalSearchValue, setInternalSearchValue] =
      useState(defaultSearchValue);
    const [triggerLayout, setTriggerLayout] = useState<TriggerLayout | null>(null);

    const formControl = useFormControlContext();

    const isDisabled = isDisabledProp ?? formControl?.isDisabled ?? false;
    const isInvalid = isInvalidProp ?? formControl?.isInvalid ?? false;
    const resolvedSize = size ?? (formControl?.size as SelectSize) ?? 'md';

    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : internalValue;
    const isMultiControlled = controlledValues !== undefined;
    const selectedValues = isMulti
      ? isMultiControlled
        ? controlledValues
        : internalValues
      : selectedValue
        ? [selectedValue]
        : [];
    const isSearchControlled = controlledSearchValue !== undefined;
    const searchValue = isSearchControlled
      ? controlledSearchValue
      : internalSearchValue;
    const shouldCloseOnSelect = closeOnSelect ?? !isMulti;

    const getLabel = useCallback(
      (value: string) => valueLabels[value] ?? registeredLabels[value] ?? value,
      [registeredLabels, valueLabels],
    );

    const selectedItems = useMemo<SelectOption[]>(
      () => selectedValues.map((value) => ({ value, label: getLabel(value) })),
      [getLabel, selectedValues],
    );

    const selectedLabel = useMemo(() => {
      if (isMulti) {
        if (formatSelectedLabel) {
          return formatSelectedLabel(selectedItems);
        }
        if (selectedItems.length === 0) return '';
        if (selectedItems.length === 1) return selectedItems[0]?.label ?? '';
        return `${selectedItems.length} items selected`;
      }

      return selectedValue
        ? internalLabel || getLabel(selectedValue)
        : '';
    }, [
      formatSelectedLabel,
      getLabel,
      internalLabel,
      isMulti,
      selectedItems,
      selectedValue,
    ]);

    const onOpen = useCallback(() => {
      if (!isDisabled) {
        setIsOpen(true);
      }
    }, [isDisabled]);

    const onClose = useCallback(() => {
      setIsOpen(false);
    }, []);

    const onValueChange = useCallback(
      (value: string, label: string) => {
        setRegisteredLabels((current) =>
          current[value] === label ? current : { ...current, [value]: label },
        );

        if (isMulti) {
          const nextValues = selectedValues.includes(value)
            ? selectedValues.filter((selected) => selected !== value)
            : [...selectedValues, value];

          if (!isMultiControlled) {
            setInternalValues(nextValues);
          }
          onValuesChange?.(nextValues);
        } else {
          if (!isControlled) {
            setInternalValue(value);
          }
          setInternalLabel(label);
          onValueChangeProp?.(value);
        }

        if (shouldCloseOnSelect) {
          setIsOpen(false);
        }
      },
      [
        isControlled,
        isMulti,
        isMultiControlled,
        onValueChangeProp,
        onValuesChange,
        selectedValues,
        shouldCloseOnSelect,
      ],
    );

    const onValueRemove = useCallback(
      (value: string) => {
        if (isMulti) {
          const nextValues = selectedValues.filter((selected) => selected !== value);
          if (!isMultiControlled) {
            setInternalValues(nextValues);
          }
          onValuesChange?.(nextValues);
          return;
        }

        if (!isControlled) {
          setInternalValue(null);
        }
        setInternalLabel('');
        onValueChangeProp?.('');
      },
      [
        isControlled,
        isMulti,
        isMultiControlled,
        onValueChangeProp,
        onValuesChange,
        selectedValues,
      ],
    );

    const handleSearchChange = useCallback(
      (value: string) => {
        if (!isSearchControlled) {
          setInternalSearchValue(value);
        }
        onSearchChange?.(value);
      },
      [isSearchControlled, onSearchChange],
    );

    const isValueSelected = useCallback(
      (value: string) => selectedValues.includes(value),
      [selectedValues],
    );

    const shouldShowItem = useCallback(
      (value: string, label: string) => {
        const normalizedSearch = searchValue.trim().toLowerCase();
        if (!normalizedSearch) return true;

        if (filterOption) {
          return filterOption(searchValue, { value, label });
        }

        return (
          label.toLowerCase().includes(normalizedSearch) ||
          value.toLowerCase().includes(normalizedSearch)
        );
      },
      [filterOption, searchValue],
    );

    const registerItem = useCallback(
      (value: string, label: string) => {
        setRegisteredLabels((current) =>
          current[value] === label ? current : { ...current, [value]: label },
        );
      },
      [],
    );

    const registerItemLayout = useCallback((value: string, y: number) => {
      setItemLayouts((current) =>
        current[value] === y ? current : { ...current, [value]: y },
      );
    }, []);

    const selectedItemLayoutY =
      selectedValue != null ? (itemLayouts[selectedValue] ?? null) : null;

    return (
      <SelectContext.Provider
        value={{
          isOpen,
          isMulti,
          selectedValue: selectedValue ?? null,
          selectedValues,
          selectedLabel,
          selectedItems,
          searchValue,
          placeholder,
          size: resolvedSize,
          variant,
          isDisabled,
          isInvalid,
          triggerLayout,
          selectedItemLayoutY,
          onOpen,
          onClose,
          onValueChange,
          onValueRemove,
          onSearchChange: handleSearchChange,
          isValueSelected,
          shouldShowItem,
          registerItem,
          registerItemLayout,
          setTriggerLayout,
        }}
      >
        <View ref={ref} className={className}>
          {children}
        </View>
      </SelectContext.Provider>
    );
  },
);

Select.displayName = 'Select';
