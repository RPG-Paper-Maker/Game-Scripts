    /**
     * @static
     * @usage This function is used to inject/overwrite original class methods and variables.
     * @experimental This function is experimental and has yet to be thoroughly tested.
     * @param classObject The class or newable function that you want to inject/overwrite a variable/method into.
     * @param prototypeName The variable/method name you want to overwrite/inject code into.
     * @param prototype The new variable/method you want to inject/overwrite.
     * @param staticType Sets rather this is a static method/variable or a non static method/variable (NOTE: Both a static and non static variable/method can exist at the same time with the same name.) (DEFAULT: false)
     * @param overwrite (METHODS ONLY) Should call original method's code or overwrite original method. (DEFAULT: false)
     * @param loadBefore (METHODS ONLY) Should original method's code be executed before or after your code (NOTE: This is obviously disabled if param overwrite is set to true.) (DEFAULT: true)
     */
    function prototypeOverwrite<T extends NewableFunction, M extends keyof T,LT extends keyof T["prototype"],TR = string,LM = NewableFunction>(classObject:T, prototypeName:LT | TR | M, prototype:T["prototype"][LT] | T[LT] | LM,staticType:boolean = false,overwrite:boolean = false,loadBefore:boolean = true){
        let TheAnyPrototype:any = prototype; //force any type, system will not accept otherwise!
        if(!staticType){
            let classPrototype = classObject.prototype[prototypeName];
            if(classPrototype instanceof Function){
                if(overwrite){
                    classObject.prototype[prototypeName] = function(...args){
                        TheAnyPrototype.call(this,...args);
                    }
                } else 
                if(loadBefore){
                    classObject.prototype[prototypeName] = function(...args){
                        classPrototype.call(this,...args);
                        TheAnyPrototype.call(this,...args);
                    }
                } else {
                    classObject.prototype[prototypeName] = function(...args){
                        TheAnyPrototype.call(this,...args);
                        classPrototype.call(this,...args);
                    }
                }
            } else {
                classObject.prototype[prototypeName] = prototype;
            }
        } else {
            let classAnyObject: any = classObject;  //force any type, system will not accept otherwise!
            let classMethod = classAnyObject[prototypeName];
            if(classMethod instanceof Function){
                if(loadBefore){
                    classAnyObject[prototypeName] = function(...args){
                        classMethod.call(this,...args);
                        TheAnyPrototype.call(this,...args);
                    }
                } else {
                    classAnyObject[prototypeName] = function(...args){
                        TheAnyPrototype.call(this,...args);
                        classMethod.call(this,...args);
                    }
                }
            } else {
                classAnyObject[prototypeName] = prototype;
            }
        }
    
    }