var AssetTool = (function () {
    return {
        loadConfig: function (jsonPathArr, nextFunc, completeFunc) {
            return wd.loadConfig(jsonPathArr).forEach(function (state) {
                if (!!nextFunc) {
                    nextFunc(state)
                }
            }).then(function () {
                if (!!completeFunc) {
                    return completeFunc()
                }
            })
        },

        loadWDB: function (wdbPath, testFunc) {
            return wd.loadWDB(wdbPath).forEach(function ([state, gameObject]) {
                testFunc([state, gameObject])
            })
            // .then(function () {
            //     if (!!completeFunc) {
            //         return completeFunc()
            //     }
            // })
        },
        loadGLB: function (glbPath) {
            return window.fetch(glbPath)
                .then((response) => response.arrayBuffer())
        }
    }
})()