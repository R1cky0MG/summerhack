# Teseract

## Configuration

On `package.json`
```js
{
  // ...
  "teseract": {

    /* Code styling */
    "style": { 
      // Spaces per tab
      "indentation": 2 
      // Kind of quotes
      "quotes": "double" // "double" | "single" 
    },

    /* Build process */
    "build": { 
      // What loader apply for each extension
      "loaders": { 
        ".mp4": "file" // loaders: "file"
      },
      // Which dependencies should be flagged as
      // external and not bundled
      "externalDependencies": [
        "crypto",
        "react",
        // ...
      ]
    }

  }
}
```
