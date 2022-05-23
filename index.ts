import React, { ReactElement, RefObject, useEffect, useState } from 'react';

interface TransitionProps {
  children: ReactElement<any, any>;
  elementRef?: RefObject<HTMLElement>;
  timeout: number | [number, number];
  classPrefix: string;
  trigger: boolean;
  onMount?: () => any;
  onMounted?: () => any;
  onUnmount?: () => any;
}

const Transition: React.FC<TransitionProps> = (props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [childNode, setChildNode] = useState<HTMLElement | null>();
  const { children, timeout, trigger, classPrefix, elementRef, onMount, onMounted, onUnmount } = props;

  useEffect(() => {
    if (childNode) {
      if (trigger) {
        if (onMount) onMount();
        setTimeout(
          () => {
            childNode.classList.replace(`${classPrefix}--mounting`, `${classPrefix}--active`);
            if (onMounted) onMounted();
          },
          Array.isArray(timeout) ? timeout[0] : timeout
        );
      } else {
        if (onUnmount) onUnmount();
        childNode.classList.replace(`${classPrefix}--active`, `${classPrefix}--unmounting`);

        const handleUnmount = () => {
          if (trigger) clearTimeout(unmountTimeout);
          else {
            setMounted(false);
            setChildNode(null);
          }
        };
        const unmountTimeout = setTimeout(handleUnmount, Array.isArray(timeout) ? timeout[1] : timeout);
      }
    } else {
      if (trigger) setMounted(true);
      const DOMElement = (children?.props.nodeRef as RefObject<HTMLElement>)?.current || elementRef?.current;
      DOMElement?.classList.add(`${classPrefix}--mounting`);
      setChildNode(DOMElement);
    }
  });

  return mounted ? children : null;
};

export default Transition;
