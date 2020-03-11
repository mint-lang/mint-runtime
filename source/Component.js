import { Component as PreactComponent } from "preact";
import { compareObjects } from "./Compare";
import { bindFunctions } from "./Utils";

const excludedMethods = [
  "componentWillMount",
  "render",
  "getSnapshotBeforeUpdate",
  "componentDidMount",
  "componentWillReceiveProps",
  "shouldComponentUpdate",
  "componentWillUpdate",
  "componentDidUpdate",
  "componentWillUnmount",
  "componentDidCatch",
  "setState",
  "forceUpdate",
  "constructor"
];

export default class Component extends PreactComponent {
  constructor(props) {
    super(props);
    bindFunctions(this, excludedMethods);
  }

  shouldComponentUpdate(props, state) {
    let propsChanged = !compareObjects(this.props, props);
    let stateChanged = !compareObjects(this.state, state);

    return propsChanged || stateChanged;
  }

  _d(object) {
    const properties = {};

    Object.keys(object).forEach(item => {
      const [foreign, value] = object[item];
      const key = foreign || item;

      properties[item] = {
        get: () => {
          return key in this.props ? this.props[key] : value;
        }
      };
    });

    Object.defineProperties(this, properties);
  }
}
