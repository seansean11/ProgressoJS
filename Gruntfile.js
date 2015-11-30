module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// SASS definitions
		sass: {
      dist: {
        files: {
          'demo/assets/main.css': 'demo/assets/scss/main.scss'
        }
      }
    },

    // Autoprefix
    autoprefixer:{
      dist:{
        files:{
          'demo/assets/main.css':'demo/assets/main.css'
        }
      }
    },

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: ["src/progresso.js"],
				dest: "dist/progresso.js",
				dest: "demo/assets/js/progresso.js"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/progresso.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/progresso.js"],
				dest: "dist/progresso.min.js",
				dest: "demo/assets/js/progresso.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		browserSync: {
		  bsFiles: {
		    src : ["demo/assets/*.css", "demo/assets/js/progresso.js", "demo/*.html"]
		  },
		  options: {
				watchTask: true,
		    server: {
		      baseDir: "./demo/"
		    }
		  }
		},

		// watch for changes to source
		watch: {
		  files: ["src/*", "demo/assets/scss/**/*.scss"],
		  tasks: ["build"]
		}
	});

	grunt.loadNpmTasks("grunt-sass");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-browser-sync");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks('grunt-autoprefixer');

	grunt.registerTask("serve", ["browserSync", "watch"]);
	grunt.registerTask("build", ["concat", "uglify", "sass", "autoprefixer"]);
	grunt.registerTask("default", ["jshint", "build"]);
	grunt.registerTask("travis", ["default"]);

};
