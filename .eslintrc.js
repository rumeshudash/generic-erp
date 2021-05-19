module.exports = {
    extends: ["react-app", "react-app/jest"],
    overrides: [
        {
            "files": ["**/*.js?(x)"],
            "rules": {
                "no-unused-expressions": "off"
            }
        }
    ]
}


// "eslintConfig": {
//     "extends": [
//         "react-app",
//         "react-app/jest"
//     ]
// },