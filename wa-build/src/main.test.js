import main from './main';

class MockGrunt {
    constructor() {
        this.config = null;
        this.modules = [];
        this.tasks = {};
        this.file = {
            readJSON: ()=>{}
        };
    }
    initConfig(config) {
        this.config = config;
    }
    loadNpmTasks(moduleName) {
        this.modules.push(moduleName);
    }
    registerTask(taskName, task) {
        this.tasks[taskName] = task;
    }
}

describe('main', () => {
    var grunt;
    beforeEach(()=>{
        grunt = new MockGrunt();
        spyOn(grunt, 'initConfig');
        main(grunt);
        expect(grunt.initConfig).toHaveBeenCalled();
    });
    it('should load NPM grunt modules', ()=> {
        expect(grunt.modules).toContain('grunt-contrib-watch');
    });
    it('should define a default task', () => {
        expect(Object.keys(grunt.tasks)).toContain('default');
    });
    it('should define a dev task', () => {
        expect(Object.keys(grunt.tasks)).toContain('dev');
    });
});