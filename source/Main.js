import ReactDOM from "react-dom";
import DateFNS from "date-fns";
import React from "react";

import { insertStyles, update, navigate, normalizeEvent, at } from "./Utils";
import { Nothing, Just } from "./Maybe";
import { compare } from "./Compare";
import { Equals } from "./Symbols";
import { Ok, Err } from "./Result";

import TestContext from "./TestContext";
import Provider from "./Provider";
import Program from "./Program";
import Decoder from "./Decoder";
import encode from "./Encoder";
import Record from "./Record";
import Store from "./Store";

import "./Ext";

export default {
  program: new Program(),

  normalizeEvent: normalizeEvent,
  insertStyles: insertStyles,
  navigate: navigate,
  compare: compare,
  update: update,
  encode: encode,
  at: at,

  Component: React.PureComponent,
  ReactDOM: ReactDOM,

  TestContext: TestContext,
  Provider: Provider,
  Store: Store,

  Nothing: Nothing,
  Just: Just,

  Err: Err,
  Ok: Ok,

  Decoder: Decoder,
  DateFNS: DateFNS,
  Record: Record,

  createPortal: ReactDOM.createPortal,
  createElement: React.createElement,

  Symbols: {
    Equals: Equals
  }
};
