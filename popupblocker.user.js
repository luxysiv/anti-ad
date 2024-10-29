// ==UserScript==
// @name         Ultra Popup Blocker (No Notification)
// @description  Configurable popup blocker that blocks all popup windows by default, without notification.
// @namespace    luxysiv
// @version      1.2
// @author       Mạnh Dương
// @include      *
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.registerMenuCommand
// ==/UserScript==

/* Constants and Globals */
const CONSTANTS = {
  TIMEOUT_SECONDS: 15,
  TRUNCATE_LENGTH: 50,
  MODAL_WIDTH: '400px'
}

// Reference to page's window through GreaseMonkey
const global = unsafeWindow
global.upbCounter = 0

// Store reference to original window.open
const realWindowOpen = global.open

// Fake window object to prevent JS errors
const FakeWindow = {
  blur: () => false,
  focus: () => false
}

/* Popup Blocker */
class PopupBlocker {
  static async initialize () {
    if (global.open !== realWindowOpen) return;

    // Block all popups
    global.open = (url, target, features) => {
      global.upbCounter++;
      console.log(`[UPB] Popup blocked: ${url}`);
      return FakeWindow;
    };
  }
}

/* Initialize */
window.addEventListener('load', () => PopupBlocker.initialize());
