import { render, h as h_p } from "preact";
import { defineComponent, h as h_vue, ref, watchEffect, onUnmounted, Teleport, } from "vue";
export function connect(component) {
    return defineComponent({
        inheritAttrs: false,
        setup(props, { attrs, slots }) {
            const containerRef = ref();
            const childrenContainerRef = ref();
            watchEffect(() => {
                if (containerRef.value) {
                    render(h_p(component, Object.assign(Object.assign({}, attrs), { setChildrenContainer: (ele) => {
                            childrenContainerRef.value = ele;
                        } })), containerRef.value);
                }
            });
            onUnmounted(() => {
                if (containerRef.value) {
                    render(null, containerRef.value);
                }
            });
            return () => {
                var _a;
                return h_vue("div", { ref: containerRef }, [
                    childrenContainerRef.value
                        ? h_vue(Teleport, { to: childrenContainerRef.value }, [
                            (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots),
                        ])
                        : null,
                ]);
            };
        },
    });
}
