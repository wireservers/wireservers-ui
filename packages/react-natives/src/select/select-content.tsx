import React, { useEffect, useRef } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { useSelectContext } from './select';
import type { SelectContentProps } from './types';
import { selectContentStyle } from './styles';

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof View>,
  SelectContentProps
>(({ className, children, ...props }, ref) => {
  const { isOpen, triggerLayout, selectedItemLayoutY } = useSelectContext();
  const { height: windowHeight } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const hasScrolledToSelectionRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      hasScrolledToSelectionRef.current = false;
      return;
    }
    if (hasScrolledToSelectionRef.current || selectedItemLayoutY == null) return;
    hasScrolledToSelectionRef.current = true;
    // Center the selected row instead of pinning it to the top, so the picker
    // reopens showing a bit of surrounding context rather than the value edge-on.
    scrollViewRef.current?.scrollTo({ y: Math.max(selectedItemLayoutY - 40, 0), animated: false });
  }, [isOpen, selectedItemLayoutY]);

  if (!triggerLayout) {
    return null;
  }

  const triggerBottom = triggerLayout.pageY + triggerLayout.height;
  const spaceBelow = windowHeight - triggerBottom - 16;
  const maxDropdownHeight = Math.min(300, Math.max(spaceBelow, 120));

  return (
    <View
      style={{
        position: 'absolute',
        top: triggerBottom + 4,
        left: triggerLayout.pageX,
        width: triggerLayout.width,
        maxHeight: maxDropdownHeight,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        bounces={false}
        showsVerticalScrollIndicator
        style={{ maxHeight: maxDropdownHeight }}
      >
        <View
          ref={ref}
          className={selectContentStyle({ class: className })}
          {...props}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
});

SelectContent.displayName = 'SelectContent';
