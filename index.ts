import React, { ReactElement, RefObject, useEffect, useState } from "react";

interface TransitionProps {
  children: ReactElement<any, any>;
  elementRef?: RefObject<HTMLElement>;
  timeout?: number | [number, number];
  classPrefix?: string;
  trigger: boolean;
  bypass?: boolean;
  onMount?: () => any;
  onMounted?: () => any;
  onUnmount?: () => any;
  onUnmounted?: () => any;
}

const Transition: React.FC<TransitionProps> = (props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [childNode, setChildNode] = useState<HTMLElement | null>();
  const { children, timeout, trigger, classPrefix, elementRef, onMount, onMounted, onUnmount, onUnmounted, bypass = false } = props;

  const parsedTimeout = timeout || 250;

  useEffect(() => {
    if (bypass) {
      setMounted(trigger);
      if (onMount && trigger) onMount();
      if (onUnmount && !trigger) onUnmount();
    } else if (childNode) {
      if (trigger) {
        if (onMount) onMount();
        setTimeout(
          () => {
            childNode.classList.replace(`${classPrefix || "component"}--mounting`, `${classPrefix || "component"}--active`);
            if (onMounted) onMounted();
          },
          Array.isArray(parsedTimeout) ? parsedTimeout[0] : parsedTimeout
        );
      } else {
        if (onUnmount) onUnmount();
        childNode.classList.replace(`${classPrefix || "component"}--active`, `${classPrefix || "component"}--unmounting`);

        const handleUnmount = () => {
          if (trigger) clearTimeout(unmountTimeout);
          else {
            setMounted(false);
            setChildNode(null);
            if (onUnmounted) onUnmounted();
          }
        };
        const unmountTimeout = setTimeout(handleUnmount, Array.isArray(parsedTimeout) ? parsedTimeout[1] : parsedTimeout);
      }
    } else {
      if (trigger) setMounted(true);
      const DOMElement = (children?.props.nodeRef as RefObject<HTMLElement>)?.current || elementRef?.current;
      DOMElement?.classList.add(`${classPrefix || "component"}--mounting`);
      setChildNode(DOMElement);
    }
  });

  return mounted ? children : null;
};

export default Transition;
