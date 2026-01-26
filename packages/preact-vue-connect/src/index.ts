import { ComponentType, render, h as h_p, Attributes } from "preact";
import {
  defineComponent,
  type DefineComponent,
  h as h_vue,
  ref,
  watchEffect,
  onUnmounted,
  Teleport,
} from "vue";

type CommonPreactComponentProps = {
  setChildrenContainer?: (ele: HTMLElement | null) => void;
};

export function connect<P extends CommonPreactComponentProps>(
  component: ComponentType<P>,
): DefineComponent<P, any, any, any, any> {
  return defineComponent<P>({
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
      const containerRef = ref();
      const childrenContainerRef = ref();

      watchEffect(() => {
        if (containerRef.value) {
          render(
            h_p(component, {
              ...attrs,
              setChildrenContainer: (ele: HTMLElement | null) => {
                childrenContainerRef.value = ele;
              },
            } as P & Attributes),
            containerRef.value,
          );
        }
      });

      onUnmounted(() => {
        if (containerRef.value) {
          render(null, containerRef.value);
        }
      });

      return () =>
        h_vue("div", { ref: containerRef }, [
          childrenContainerRef.value
            ? h_vue(Teleport, { to: childrenContainerRef.value }, [
                slots.default?.(),
              ])
            : null,
        ]);
    },
  }) as any;
}
