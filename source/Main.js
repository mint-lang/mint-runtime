import ReactDOM from "react-dom";
import DateFNS from "date-fns";
import React from "react";

import { insertStyles, update, navigate, normalizeEvent } from "./Utils";
import { Nothing, Just } from "./Maybe";
import { compare } from "./Compare";
import { Equals } from "./Symbols";
import { Ok, Err } from "./Result";

import TestContext from "./TestContext";
import Provider from "./Provider";
import Program from "./Program";
import Decoder from "./Decoder";
import Record from "./Record";
import Store from "./Store";

import "./Ext";

const fn = (input) => {
  let test = Decoder.field(`test`, Decoder.number)(input)
  if (test instanceof Err) { return test }

  let author = Decoder.field(`author`, (input) => {
    let name = Decoder.field(`name`, Decoder.string)(input)
    if (name instanceof Err) { return name }

    return new Ok({
      name: name.value
    })
  })(input)
  if (author instanceof Err) { return author }

  return new Ok({
    test: test.value,
    author: author.value
  })
}

export default {
  program: new Program(),

  normalizeEvent: normalizeEvent,
  insertStyles: insertStyles,
  navigate: navigate,
  compare: compare,
  update: update,

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
