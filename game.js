class Game {
	_exceptionReg = /^\s*$/u;

	constructor(options) {
		// 初期値
		this._opt = options || {};
		for (let i = 1; i <= 4; i++) {
			this._opt["info" + i] ??= "情報" + i;
			this._opt["placeholder" + i] ??= "例：";
		}

		// 無理やりbind
		this._eventHandler = function () {
			document.removeEventListener("DOMContentLoaded", this._eventHandler);
			this.init();
		}.bind(this);

		// イベントを無理やり発火
		if (document.readyState !== "loading") {
			this.init();
		} else {
			document.addEventListener("DOMContentLoaded", this._eventHandler);
		}
	}

	init() {
		this._div_form = acq("#form");
		this._div_game = acq("#game");
		this._nameElems = [acq("#f_name"), acq("#t_name")];
		this._infoElems = [];

		this._nameElems[0].value = this.getItem("name") || "";

		for (let i = 1; i <= 4; i++) {
			const f_info = acq("#f_info" + i);
			f_info.placeholder = "例：" + this._opt["placeholder" + i];
			const op = this._opt["info" + i];
			const v = this.getItem(op);
			if (v) {
				f_info.value = v;
			}

			this._infoElems.push([f_info, acq("#g_info" + i)]);

			const p_info = acq(".p_info" + i);
			for (let e of p_info) {
				e.innerText = op;
			}
		}
	}

	start() {
		let tmp = this._nameElems[0].value.trim();
		let flag = true;
		if (this._exceptionReg.test(tmp)) {
			flag = false;
			this._nameElems[0].value = "";
		} else {
			this._nameElems[1].innerText = tmp;
			this.setItem("name", tmp);
		}
		for (let i = 0; i < 4; i++) {
			tmp = this._infoElems[i][0].value.trim();
			if (this._exceptionReg.test(tmp)) {
				flag = false;
				this._infoElems[i][0].value = "";
			} else {
				this._infoElems[i][1].innerText = tmp;
				this.setItem(this._opt["info" + (i + 1)], tmp);
			}
		}

		if (flag) {
			this.toGame();
		}
		return false;
	}

	toGame() {
		this._div_form.style.display = "none";
		this._div_game.style.display = "block";
	}

	toForm() {
		this._div_form.style.display = "block";
		this._div_game.style.display = "none";
	}

	setItem(key, value) {
		localStorage.setItem(key, value);
	}
	getItem(key) {
		return localStorage.getItem(key);
	}
}

function acq(str) {
	if (!str) return;
	let qs = str.slice(1);
	switch (str.slice(0, 1)) {
		case "#":
			return document.getElementById(qs);
		case ".":
			return document.getElementsByClassName(qs);
	}
	return document.getElementsByTagName(str);
}

function readUrlGet() {
	const urlParams = new URL(window.location.href).searchParams;

	if (urlParams.get("reset") || urlParams.get("clear")) {
		localStorage.clear();
	}

	window.game = new Game({
		info1: urlParams.get("in1") || "趣味",
		placeholder1: urlParams.get("pl1") || "釣り",
		info2: urlParams.get("in2") || "好きな食べ物",
		placeholder2: urlParams.get("pl2") || "大福",
		info3: urlParams.get("in3") || "好きな動物",
		placeholder3: urlParams.get("pl3") || "猫",
		info4: urlParams.get("in4") || "得意な科目",
		placeholder4: urlParams.get("pl4") || "全部",
	});
}
