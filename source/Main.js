import ReactDOM from "react-dom";
import DateFNS from "date-fns";
import React from "react";

import {
  insertStyles,
  update,
  navigate,
  normalizeEvent,
  at,
  array,
  style
} from "./Utils";
import { compare } from "./Compare";
import { Equals } from "./Symbols";

import EmbeddedProgram from "./EmbeddedProgram";
import { Record, create } from "./Record";
import TestContext from "./TestContext";
import Component from "./Component";
import Provider from "./Provider";
import Program from "./Program";
import Decoder from "./Decoder";
import encode from "./Encoder";
import Module from "./Module";
import Store from "./Store";
import Enum from "./Enum";

import "./Ext";

export default enums => {
  const DecoderWithEnums = Decoder(enums);

  return {
    program: new (Program(enums))(),

    normalizeEvent: normalizeEvent,
    insertStyles: insertStyles,
    navigate: navigate,
    compare: compare,
    update: update,
    array: array,
    style: style,

    encode: encode(enums),
    at: at(enums),

    ReactDOM: ReactDOM,
    React: React,

    EmbeddedProgram: EmbeddedProgram,
    TestContext: TestContext,
    Component: Component,
    Provider: Provider,
    Module: Module,
    Store: Store,

    Decoder: DecoderWithEnums,
    DateFNS: DateFNS,
    Record: Record,
    Enum: Enum,

    Nothing: enums.nothing,
    Just: enums.just,

    Err: enums.err,
    Ok: enums.ok,

    createRecord: create(DecoderWithEnums, enums),
    createPortal: ReactDOM.createPortal,
    createElement: React.createElement,

    Symbols: {
      Equals: Equals
    }
  };
};
