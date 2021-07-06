import React, { ComponentType, ReactNode, useEffect, useState } from 'react';

type FlowComponent<P = any, O = void> = ComponentType<P & ({ finish: (output: O) => void })>;

interface FlowFunctionTools {
    render<P, O = void>(component: FlowComponent<P, O>, props?: P): Promise<O>;
}

type FlowFunction<O> = (tools: FlowFunctionTools) => Promise<O>;

export default function createFlow<P, O = void>(flowCreator: (props: P) => FlowFunction<O>) {
    function FlowComponent(props: P & { onFinish?: (output: O) => void }) {
        const [renderProps, setRenderProps] = useState({
            component: null as unknown as FlowComponent,
            props: null as unknown,
            key: -1
        });

        // Main runner
        useEffect(() => {
            const tools: FlowFunctionTools = {
                render<P, O = void>(component: FlowComponent<P, O>, rProps?: P) {
                    return new Promise<O>(resolve => {
                        setRenderProps(prev => ({
                            component,
                            props: { ...rProps, finish: resolve },
                            key: prev.key + 1
                        }));
                    });
                }
            };

            (async () => {
                const output = await flowCreator(props)(tools);

                props.onFinish?.(output);
            })();
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
            <CurrentComponent key={key} {...currentProps} />
        );
    }

    return FlowComponent;
}