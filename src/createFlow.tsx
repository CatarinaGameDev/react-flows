import React, { ComponentType, ReactNode, useEffect, useState } from 'react';

type FlowComponent<P = any, O = void> = ComponentType<P & { finish(output: O): void }>;

interface FlowFunctionTools {
    render<P, O>(component: FlowComponent<P, O>, props?: P): Promise<O>;
}

type FlowFunction = (tools: FlowFunctionTools) => Promise<void>

export default function createFlow<P>(flowCreator: (props: P) => FlowFunction) {
    function FlowComponent(props: P): ReactNode {
        const [renderProps, setRenderProps] = useState({
            component: null as unknown as FlowComponent,
            props: null as unknown,
            key: -1
        });

        // Main runner
        useEffect(() => {
            const tools: FlowFunctionTools = {
                render<P, O>(component: FlowComponent<P, O>, props?: P) {
                    return new Promise<O>(resolve => {
                        setRenderProps(prev => ({
                            component,
                            props: { ...props, finish: resolve },
                            key: prev.key + 1
                        }));
                    });
                }
            };

            flowCreator(props)(tools);
        }, []);

        const {
            component: CurrentComponent,
            props: currentProps,
            key
        } = renderProps;

        if (!CurrentComponent) {
            return null;
        }

        return (
            <CurrentComponent key={key} {...props} />
        );
    }

    return FlowComponent;
}