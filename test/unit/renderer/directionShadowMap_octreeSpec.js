describe("direction shadow map with octree", function() {
    var sandbox = null;
    var shadow = null;

    var director;
    var sphere;
    var light;

    var renderer;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        testTool.openContractCheck(sandbox);

        testTool.clearInstance();
        director = wd.Director.getInstance();


        sandbox.stub(wd.DeviceManager.getInstance(), "gl", testTool.buildFakeGl(sandbox));

        renderer = wd.WebGLRenderer.create();
    });
    afterEach(function () {
        sandbox.restore();
        testTool.clearInstance();
    });

    describe("integrate test", function(){
        var octreeObject;

        function createSphere() {
            return shadowTool.createSphere();
        }

        function createOctree(){
            return octreeTool.createOctree();
        }

        beforeEach(function(){
            sphere = createSphere();

            octreeObject = createOctree();

            octreeObject.addChild(sphere);

            light = shadowTool.createDirectionLight();

            director.scene.addChild(octreeObject);
            director.scene.addChild(light);


            director.scene.addChild(testTool.createCamera());

            prepareTool.prepareForMap(sandbox);
        });
        
        it("not allow: the first level object of space partition object not contain shadow component but its children contain", function(){
            testTool.openContractCheck(sandbox);
            sphere.removeComponent(wd.Shadow);

            var child = createSphere();
            child.addComponent(wd.Shadow.create());

            sphere.addChild(child);


            expect(function(){
                director._init();

                director.scene.gameObjectScene.render(renderer);
            }).toThrow();
        });

        describe("build shadow map", function() {
            var shader, program;

            function setBuildShadowMapShaderAndProgram(obj, handleProgramFunc) {
                var useShader = director.scene.useShader;

                sandbox.stub(director.scene, "useShader", function (shaderKey) {
                    useShader.call(director.scene, shaderKey);

                    var material = obj.getComponent(wd.Geometry).material;

                    shader = material.shader;
                    program = shader.program;

                    if (handleProgramFunc) {
                        handleProgramFunc(program);
                    }
                });
            }


            describe("if cast shadow", function(){
                beforeEach(function(){
                    sphere.getComponent(wd.Shadow).cast = true;
                });

                it("send u_vpMatrixFromLight,u_mMatrix,u_vMatrix,u_pMatrix,a_position", function () {
                    setBuildShadowMapShaderAndProgram(sphere, function (program) {
                        sandbox.stub(program, "sendAttributeData");
                        sandbox.stub(program, "sendUniformData");
                    });


                    director._init();

                    director.scene.gameObjectScene.render(renderer);


                    expect(program.sendUniformData.withArgs("u_vpMatrixFromLight")).toCalledOnce();
                    expect(program.sendUniformData.withArgs("u_vpMatrixFromLight").firstCall.args[2]).toEqual(jasmine.any(wd.Matrix4));
                    expect(program.sendUniformData.withArgs("u_mMatrix")).toCalledBefore(program.sendUniformData.withArgs("u_vpMatrixFromLight"));
                    expect(program.sendUniformData.withArgs("u_vMatrix")).toCalledBefore(program.sendUniformData.withArgs("u_vpMatrixFromLight"));
                    expect(program.sendUniformData.withArgs("u_pMatrix")).toCalledBefore(program.sendUniformData.withArgs("u_vpMatrixFromLight"));
                    expect(program.sendAttributeData.withArgs("a_position")).toCalledBefore(program.sendUniformData.withArgs("u_vpMatrixFromLight"));
                });
            });
        });

        describe("draw based on shadow map", function() {
            var shader, program;

            function setDrawShadowMapShaderAndProgram() {
                var data = shadowTool.setDrawShadowMapShaderAndProgramHelper(sandbox, sphere);

                shader = data.shader;
                program = data.program;
            }

            describe("test shadow map", function () {
                beforeEach(function () {
                });

                describe("if receive shadow", function () {
                    beforeEach(function () {
                        sphere.getComponent(wd.Shadow).receive = true;
                    });

                    it("should send shadow map data", function () {
                        director._init();

                        setDrawShadowMapShaderAndProgram();
                        director._loopBody(1);

                        expect(program.sendUniformData.withArgs("u_twoDShadowMapSampler[0]", sinon.match.any, 0)).toCalledOnce();
                        expect(program.sendUniformData.withArgs("u_diffuseMapSampler", sinon.match.any, 1)).toCalledOnce();
                    });

                    it("fs glsl should contain shadow map glsl", function () {
                        director._init();

                        setDrawShadowMapShaderAndProgram();
                        director._loopBody(1);

                        expect(glslTool.contain(shader.fsSource, "u_twoDShadowMapSampler")).toBeTruthy();
                    });


                });

                describe("test object with children", function () {
                    var part1, part2;
                    var program1, program2;
                    var shader1, shader2;

                    function setChildrenDrawShadowMapShaderAndProgram() {
                        var data1 = shadowTool.setDrawShadowMapShaderAndProgramHelper(sandbox, part1);
                        var data2 = shadowTool.setDrawShadowMapShaderAndProgramHelper(sandbox, part2);

                        shader1 = data1.shader;
                        shader2 = data2.shader;

                        program1 = data1.program;
                        program2 = data2.program;
                    }

                    beforeEach(function () {
                        part1 = createSphere();
                        part1.removeComponent(wd.Shadow);

                        part2 = createSphere();
                        part2.removeComponent(wd.Shadow);

                        part1.addChild(part2);

                        sphere.addChild(part1);
                    });

                    describe("if receive shadow", function () {
                        beforeEach(function () {
                            sphere.getComponent(wd.Shadow).receive = true;

                            director._init();

                            setChildrenDrawShadowMapShaderAndProgram();
                            director._loopBody(1);

                        });

                        it("children should send shadow map data", function () {
                            expect(program1.sendUniformData.withArgs("u_twoDShadowMapSampler[0]", sinon.match.any, 0)).toCalledOnce();
                            expect(program1.sendUniformData.withArgs("u_diffuseMapSampler", sinon.match.any, 1)).toCalledOnce();

                            expect(program2.sendUniformData.withArgs("u_twoDShadowMapSampler[0]", sinon.match.any, 0)).toCalledOnce();
                            expect(program2.sendUniformData.withArgs("u_diffuseMapSampler", sinon.match.any, 1)).toCalledOnce();
                        });

                        it("children fs glsl should contain shadow map glsl", function () {
                            expect(glslTool.contain(shader1.fsSource, "u_twoDShadowMapSampler")).toBeTruthy();
                            expect(glslTool.contain(shader2.fsSource, "u_twoDShadowMapSampler")).toBeTruthy();
                        });
                    });

                    describe("if not receive shadow", function () {
                        beforeEach(function () {
                            sphere.getComponent(wd.Shadow).receive = false;

                            director._init();

                            setChildrenDrawShadowMapShaderAndProgram();
                            director._loopBody(1);

                        });

                        it("shouldn't send shadow map data", function () {
                            expect(program1.sendUniformData.withArgs("u_twoDShadowMapSampler[0]", sinon.match.any, 0)).not.toCalled();

                            expect(program2.sendUniformData.withArgs("u_twoDShadowMapSampler[0]", sinon.match.any, 0)).not.toCalled();
                        });

                        it("fs glsl shouldn't contain shadow map glsl", function () {
                            expect(glslTool.contain(shader1.fsSource, "u_twoDShadowMapSampler")).toBeFalsy();

                            expect(glslTool.contain(shader2.fsSource, "u_twoDShadowMapSampler")).toBeFalsy();
                        });
                    });
                });
            });

        });
    });
});

