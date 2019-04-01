import React from "react";
import { bindFunctions } from "./Utils";

const excludedMethods = [
  "componentWillMount",
  "UNSAFE_componentWillMount",
  "render",
  "getSnapshotBeforeUpdate",
  "componentDidMount",
  "componentWillReceiveProps",
  "UNSAFE_componentWillReceiveProps",
  "shouldComponentUpdate",
  "componentWillUpdate",
  "UNSAFE_componentWillUpdate",
  "componentDidUpdate",
  "componentWillUnmount",
  "componentDidCatch",
  "setState",
  "forceUpdate",
  "constructor"
];

export default class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    bindFunctions(this, excludedMethods);
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
