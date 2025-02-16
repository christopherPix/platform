import { shallowMount, createLocalVue } from '@vue/test-utils';
import 'src/module/sw-flow/component/modals/sw-flow-app-action-modal';
import 'src/app/component/form/select/base/sw-select-base';
import 'src/app/component/form/field-base/sw-block-field';
import 'src/app/component/form/field-base/sw-base-field';
import 'src/app/component/form/select/base/sw-select-result-list';
import 'src/app/component/form/select/base/sw-select-selection-list';
import 'src/app/component/form/sw-form-field-renderer';
import 'src/app/component/form/sw-field';
import 'src/app/component/form/sw-text-field';
import 'src/app/component/form/field-base/sw-field-error';
import 'src/app/component/form/select/base/sw-multi-select';

import Vuex from 'vuex';

const sequence = {
    sequence: {
        propsAppFlowAction: {
            appId: 'id',
            name: 'telegram.send.message',
            app: {
                active: true,
                label: 'Flow Builder App',
            },
            config: [
                {
                    name: 'content',
                    type: 'multi-select',
                    label: {
                        deDE: 'content De',
                        enGB: 'content EN',
                    },
                    helpText: {
                        deDE: 'Help text DE',
                        enGB: 'Help text EN',
                    },
                    options: [
                        {
                            label: {
                                deDE: 'Option 1',
                                enGB: 'Option 1',
                            },
                            value: 1
                        },
                        {
                            label: {
                                deDE: 'Option 2',
                                enGB: 'Option 2',
                            },
                            value: 2
                        },
                        {
                            label: {
                                deDE: 'Option 3',
                                enGB: 'Option 3',
                            },
                            value: 3
                        },
                    ],
                    required: true,
                }
            ],
        }
    }
};

function createWrapper() {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    return shallowMount(Shopware.Component.build('sw-flow-app-action-modal'), {
        localVue,
        provide: {
            validationService: {},
            repositoryFactory: {
                create: () => {
                    return {
                        search: () => Promise.resolve([]),
                        get: () => Promise.resolve()
                    };
                }
            }
        },

        propsData: sequence,

        stubs: {
            'sw-form-field-renderer': Shopware.Component.build('sw-form-field-renderer'),
            'sw-multi-select': Shopware.Component.build('sw-multi-select'),
            'sw-select-base': Shopware.Component.build('sw-select-base'),
            'sw-block-field': Shopware.Component.build('sw-block-field'),
            'sw-base-field': Shopware.Component.build('sw-base-field'),
            'sw-select-selection-list': Shopware.Component.build('sw-select-selection-list'),
            'sw-field-error': Shopware.Component.build('sw-field-error'),
            'sw-modal': {
                template: `
                    <div class="sw-modal">
                      <slot name="modal-header"></slot>
                      <slot></slot>
                      <slot name="modal-footer"></slot>
                    </div>
                `
            },
            'sw-button': {
                template: '<button @click="$emit(\'click\', $event)"><slot></slot></button>'
            },
            'sw-entity-single-select': true,
            'sw-label': true,
            'sw-icon': true,
        }
    });
}

describe('module/sw-flow/component/sw-flow-tag-modal', () => {
    it('should show these fields on modal', async () => {
        const wrapper = createWrapper();
        await wrapper.vm.$nextTick();

        const fields = wrapper.findAll('.sw-form-field-renderer');
        expect(fields.length).toEqual(1);
    });

    it('should show error if these fields are invalid', async () => {
        const wrapper = createWrapper();
        const buttonSave = wrapper.find('.sw-flow-app-action-modal__save-button');
        await buttonSave.trigger('click');

        const fields = wrapper.findAll('.sw-form-field-renderer');
        expect(fields.at(0).classes()).toContain('has--error');
    });

    it('should emit process-finish when save action', async () => {
        const wrapper = createWrapper();

        wrapper.setData({
            config: {
                content: [1]
            }
        });

        const saveButton = wrapper.find('.sw-flow-app-action-modal__save-button');
        await saveButton.trigger('click');
        expect(wrapper.emitted()['process-finish'][0][0].config).toEqual({
            content: [1]
        });
    });

    it('should correct the action title', async () => {
        sequence.sequence.config = {
            content: [1, 2]
        };
        const wrapper = createWrapper();

        const title = wrapper.find('.sw-flow-app-action-modal__app-badge');
        expect(title.text()).toEqual('Flow Builder App');
    });
});
