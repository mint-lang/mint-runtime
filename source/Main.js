import ReactDOM from "react-dom";
import DateFNS from "date-fns";
import React from "react";

import { insertStyles, update, navigate } from "./Utils";
import { Nothing, Just } from "./Maybe";
import { compare } from "./Compare";
import { Equals } from "./Symbols";
import { Ok, Err } from "./Result";

import TestContext from "./TestContext";
import Provider from "./Provider";
import Program from "./Program";
import Record from "./Record";
import Store from "./Store";

import "./Ext";

export default {
  compare: compare,
  program: new Program(),
  insertStyles: insertStyles,
  navigate: navigate,
  update: update,

  Component: React.PureComponent,

  TestContext: TestContext,
  Provider: Provider,
  Store: Store,

  Nothing: Nothing,
  Just: Just,

  Err: Err,
  Ok: Ok,

  Record: Record,
  Date: DateFNS,

  createPortal: ReactDOM.createPortal,
  createElement: React.createElement,

  Symbols: {
    Equals: Equals
  }
};
