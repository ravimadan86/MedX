import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import Medx from "medx.js";
import CONFIG from "../config";

declare var TruffleContract;
declare var lightwallet;

/*
  Generated class for the MedXProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MedXProvider {
	public Medx = null;

	constructor() {
	}

	private _init() {
		Medx.setPasswordSetter(function () {
			let password = prompt(
				"Please enter a password to encrypt your seed",
				"password"
			);
			if (password) {
				return password;
			}
		});
		Medx.setPasswordGetter(function () {
			let password = prompt(
				"Please enter your password to continue",
				"password"
			);
			if (password) {
				return password;
			}
		});

		return new Promise((resolve, reject) => {
			Medx.init({
				TruffleContract: TruffleContract,
				LightWallet: lightwallet,
				server: CONFIG.IS_PRODUCTION
					? Medx.SERVERS.RINKEBY
					: Medx.SERVERS.LOCALHOST,
				passwordGetter: function () {
					let password = prompt(
						"Please enter your password to continue",
						"password"
					);
					if (password) {
						return password;
					}
				},
				passwordSetter: function () {
					let password = prompt(
						"Please enter a password to encrypt your seed",
						"password"
					);
					if (password) {
						return password;
					}
				}
			})
				.then(Medx => {
					this.Medx = Medx;
					resolve(Medx);
				})
				.catch(err => reject(err));
		});
	}

	public async getInstance() {
		try {
			if (!this.Medx) {
				this.Medx = await this._init();
			}
		} catch (err) {
			alert(err);
		}
		return this.Medx;
	}
}
