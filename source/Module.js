import { bindFunctions } from './Utils'

export default class Module {
  constructor() {
    bindFunctions(this);
  }
}
