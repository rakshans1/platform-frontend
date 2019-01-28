import "reflect-metadata";

import enLocaleData from "react-intl/locale-data/en";
import StoryRouter from "storybook-react-router";
import { addLocaleData } from "react-intl";
import { checkA11y } from "@storybook/addon-a11y";
import { configure, addDecorator } from "@storybook/react";
import { configureViewport, INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { initScreenshot, withScreenshot } from "storybook-chrome-screenshot/lib";
import { setIntlConfig, withIntl } from "storybook-addon-intl";
import { withInfo } from "@storybook/addon-info";
import { withOptions } from "@storybook/addon-options";

import { withStore } from "../app/utils/storeDecorator";

import languageEn from "../intl/locales/en-en.json";

// Provide your messages
const messages = {
  en: languageEn,
};

const getMessages = locale => messages[locale];

// Set intl configuration
addLocaleData(enLocaleData);
setIntlConfig({
  locales: ["en"],
  defaultLocale: "en",
  getMessages,
});

if (process.env.NF_STORYBOOK_SCREENSHOT) {
  addDecorator(initScreenshot());
  addDecorator(
    withScreenshot({
      delay: 1000,
      viewport: [
        // Mobile
        {
          width: 375,
          height: 667,
        },
        // Tablet
        {
          width: 768,
          height: 800,
        },
        // Desktop
        {
          width: 1200,
          height: 800,
        },
      ],
    }),
  );
} else {
  addDecorator(
    withOptions({
      name: "Neufund Pattern Library",
      url: "platform.neufund.org",
    }),
  );
  addDecorator(
    withInfo({
      inline: true,
      header: false,
    }),
  );
  addDecorator(checkA11y);
}

addDecorator(withIntl);
addDecorator(StoryRouter());
addDecorator(withStore());

// Load storybook
const req = require.context("../app/components/", true, /stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

const newViewports = {
  768: {
    name: "768px wide",
    styles: {
      width: "768px",
      height: "800px",
    },
  },
  992: {
    name: "992px wide",
    styles: {
      width: "990px",
      height: "800px",
    },
  },
  1200: {
    name: "1200px wide",
    styles: {
      width: "1200px",
      height: "800px",
    },
  },
};

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...newViewports,
  },
  defaultViewport: "responsive",
});

configure(loadStories, module);
