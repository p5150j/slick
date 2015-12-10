"use strict";
/// <reference path="../../typings/tsd.d.ts" />

export class ValidationError extends Error {

  public status;
  public error;
  public full;

  constructor(message, error = null, status = 400){
    super(message);
    this.message = message;
    this.status = status;
    this.error = error && error.message;
    this.full = error;
  }

}

