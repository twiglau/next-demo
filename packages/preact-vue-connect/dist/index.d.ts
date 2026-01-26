import { ComponentType } from "preact";
import { type DefineComponent } from "vue";
type CommonPreactComponentProps = {
    setChildrenContainer?: (ele: HTMLElement | null) => void;
};
export declare function connect<P extends CommonPreactComponentProps>(component: ComponentType<P>): DefineComponent<P, any, any, any, any>;
export {};
