module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "./internals/webpack/webpack.prod.babel.js",
      },
    },
  },
  "plugins": [
    "redux-saga",
    "react",
    "jsx-a11y",
    "graphql",
    "babel",
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "rules": {
    "semi": 0,
    "no-console": 1,
    "max-len": [1, 80],
    "require-yield": 0,
    "arrow-parens": ["error", "as-needed"],
    "arrow-body-style": [2, "as-needed"],
    "comma-dangle": [2, "always-multiline"],
    "indent": [2, 2, { "SwitchCase": 1 }],
    "no-confusing-arrow": 0,
    "no-param-reassign": ["error", { "props": false }],
    "no-use-before-define": 0,
    "class-methods-use-this": 0,
    "newline-per-chained-call": 0,
    "no-param-reassign": ['error', { 'props': false }],
    "no-unused-expressions": ['error', {
      'allowShortCircuit': true,
      'allowTernary': true,
    }],

    "graphql/template-strings": ['error', {
      env: 'relay',
      schemaJson: require('./schema.json'),
    }],

    "import/imports-first": 0,
    "import/no-dynamic-require": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-named-as-default": 0,
    "import/prefer-default-export": 0,

    "react/forbid-prop-types": 0,
    "react/jsx-first-prop-new-line": [2, "multiline"],
    "react/jsx-filename-extension": 0,
    "react/jsx-no-target-blank": 0,
    "react/require-extension": 0,
    "react/self-closing-comp": 0,
    "react/sort-comp": [2, {
      "order": [
        'static-methods',
        'lifecycle',
        'everything-else',
        '/^on.+$/',
        '/^handle.+$/',
        'rendering',
      ],
      "groups": {
        "rendering": [
          '/^render.+$/',
          'render'
        ]
      }
    }],

    "import/no-webpack-loader-syntax": 0,

    "redux-saga/no-yield-in-race": 2,
    "redux-saga/yield-effects": 2,

    "jsx-a11y/aria-props": 2,
    "jsx-a11y/heading-has-content": 0,
    "jsx-a11y/href-no-hash": 2,
    "jsx-a11y/label-has-for": 2,
    "jsx-a11y/mouse-events-have-key-events": 2,
    "jsx-a11y/role-has-required-aria-props": 2,
    "jsx-a11y/role-supports-aria-props": 2,
  },
}