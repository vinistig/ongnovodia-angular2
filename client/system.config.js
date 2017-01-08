(function(global) {
    var map = {
        'app':      'build',
        'rxjs':     'node_modules/rxjs',
        '@angular': 'node_modules/@angular',
		'@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
        'ng2-pagination': 'node_modules/ng2-pagination'
    };

    var packages = {
        'app':  { main: 'main.js',  defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
		'ng2-modal': { main: 'index.js', defaultExtension: 'js' },
        'ng2-pagination': { main: './index.js', defaultExtension: 'js' }
    };

    var angularPackages = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'router',
		'forms'
    ];

    angularPackages.forEach(function(pkgName) {
        packages['@angular/' + pkgName] = {
            main: 'bundles/' + pkgName + '.umd.js',
            defaultExtension: 'js'
        };
    });

    var config = {
        map: map,
        packages: packages
    };

  System.config(config);

})(this);
