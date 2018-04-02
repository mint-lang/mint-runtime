import ReactDOM from "react-dom";
import DateFNS from "date-fns";
import React from "react";

import { Nothing, Just } from "./Maybe";
import { Equals } from "./Symbols";
import { Ok, Err } from "./Result";
import { compare } from "./Utils";

import TestContext from "./TestContext";
import Provider from "./Provider";
import Record from "./Record";
import Store from "./Store";

import "./Ext";

export default {
  compare: compare,
  Component: React.Component,

  TestContext: TestContext,
  Provider: Provider,
  Store: Store,

  Nothing: Nothing,
  Just: Just,

  Err: Err,
  Ok: Ok,

  Date: DateFNS,

  Symbols: {
    Equals: Equals
  }
};
