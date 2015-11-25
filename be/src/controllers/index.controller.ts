"use strict";
/// <reference path="../../typings/tsd.d.ts" />
import express = require("express");

class IndexController {
	constructor() {
	}

	public static read(req : express.Request, res : express.Response, next : Function) : void {
		res.send({ title: "Express" });
	}
}

export = IndexController;