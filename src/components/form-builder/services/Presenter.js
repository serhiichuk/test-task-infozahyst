import { CONFIG_ITEM_TYPE_MAP, ENUM_TYPES } from './FormBuilderConfig';

export default class Presenter {
    getViewModel(config, model) {
        return {
            model,
            form: this._getForm(config.attributes, model),
        };
    }

    _getForm(attributes, model) {

    }

    /**
     * @param {object[]} enumList
     * @returns {object[]}
     */
    _getOptionsThree(enumList) {
        const idToIndexMap = {};
        const options      = [];
        const result       = [];

        for (let i = 0; i < enumList.length; i += 1) {
            idToIndexMap[enumList[i].id] = i;
            options.push({
                value:    enumList[i].id,
                label:    enumList[i].title,
                parentId: enumList[i].parentId,
            });
        }

        for (let i = 0; i < options.length; i += 1) {
            const node = options[i];

            if (node.parentId) {
                if (!options[idToIndexMap[node.parentId]].children) {
                    options[idToIndexMap[node.parentId]].children = [];
                }

                options[idToIndexMap[node.parentId]].children.push(node);
            } else {
                result.push(node);
            }
        }

        return result;
    }
}
