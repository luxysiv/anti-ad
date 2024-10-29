// ==UserScript==
// @name         Ultra Popup Blocker (No Notification)
// @description  Configurable popup blocker that blocks all popup windows by default, without notification.
// @namespace    luxysiv
// @version      1.1
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

/* Domain Management */
class DomainManager {
  static async getCurrentTopDomain () {
    const [domainName, topLevelDomain] = document.location.hostname.split('.').slice(-2)
    return `${domainName}.${topLevelDomain}`
  }

  static async isCurrentDomainTrusted () {
    const domain = await this.getCurrentTopDomain()
    return await GM.getValue(domain)
  }

  static async addTrustedDomain (domain) {
    await GM.setValue(domain, true)
  }

  static async removeTrustedDomain (domain) {
    await GM.deleteValue(domain)
  }

  static async getTrustedDomains () {
    return await GM.listValues()
  }
}

/* Popup Blocker */
class PopupBlocker {
  static async initialize () {
    if (global.open !== realWindowOpen) return;

    if (await DomainManager.isCurrentDomainTrusted()) {
      const domain = await DomainManager.getCurrentTopDomain();
      console.log(`[UPB] Trusted domain: ${domain}`);
      global.open = realWindowOpen;
      return;
    }

    global.open = (url, target, features) => {
      global.upbCounter++;
      console.log(`[UPB] Popup blocked: ${url}`);
      return FakeWindow;
    };
  }
}

/* Initialize */
window.addEventListener('load', () => PopupBlocker.initialize());
GM.registerMenuCommand('Ultra Popup Blocker: Trusted domains', () => new TrustedDomainsModal().show());
