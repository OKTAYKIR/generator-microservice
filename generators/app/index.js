'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var guid = require('uuid');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  },

  init: function () {
    this.log(yosay('Welcome to the micro-service scaffolding generator, ladies and gentlemen!'));
    this.appData = {};
  },

  askForAppData: function () {
    var done = this.async();

    this.prompt([{
      type: 'input',
      name: 'microserviceKey',
      message: 'What is the your micro-service name?',
      default: 'Rocket',
      required: true
    }, {
      type: 'input',
      name: 'microserviceDescription',
      message: 'Micro-service description?',
      default: 'Rocket micro-service for platform',
      required: true
    }, {
      type: 'input',
      name: 'requestModelName',
      message: 'Resource/request model name?',
      required: true
    }, {
      type: 'input',
      name: 'responseModelName',
      message: 'Resource/response model name?',
      required: true
    }, {
      type: 'list',
      name: 'authorizationRole',
      message: 'Authorization role name?',
	  choices: [ 'User', 'Developer', 'Application'],
      required: true
    }, {
      type: 'input',
      name: 'release_LoggingDBConnectionString',
      message: 'Production database connection string for logging?',
      required: true
    }, {
      type: 'input',
      name: 'development_LoggingDBConnectionString',
      message: 'Local database connection string for logging?',
      required: true
    }, {
      type: 'input',
      name: 'development_CurrentMicroservicePort',
      message: 'Microservice running port for Development environment?',
      required: true
    }, {
      type: 'input',
      name: 'development_CurrentMicroserviceRegistrationName',
      message: 'Microservice registration name for Development environment?',
	  default: 'rocket',
      required: true
    }
	], function (props) {
      this.appData = props;
	  this.appData.microserviceKey = props.microserviceKey;
      this.appData.microserviceName = 'MS.' + props.microserviceKey;
	  this.appData.controllerName = props.microserviceKey + 'Controller';
	  this.appData.projectName = this.appData.microserviceName.replace(/\s+/g, '') + '.API';
      this.appData.microserviceDescription = props.microserviceDescription;
	  this.appData.applicationFolder = this.appData.projectName;
      this.appData.apiProjectGuid = guid.v4();
      this.appData.projectGuid = guid.v4();
      this.appData.solutionGuid = guid.v4();
      this.appData.requestModelName = props.requestModelName;
	  this.appData.responseModelName = props.responseModelName;
	  this.appData.authorizationRole = props.authorizationRole;
	  this.appData.release_LoggingDBConnectionString = props.release_LoggingDBConnectionString;
	  this.appData.development_LoggingDBConnectionString = props.development_LoggingDBConnectionString;
	  this.appData.development_CurrentMicroservicePort = props.development_CurrentMicroservicePort;
	  this.appData.development_CurrentMicroserviceRegistrationName = props.development_CurrentMicroserviceRegistrationName;
      done();
    }.bind(this));
  },

  writing: function () {
    this.sourceRoot(path.join(__dirname, '../projects'));
  },

  appPaths: function () {
    this.appDirectory = path.join(this.destinationRoot(), this.appData.applicationFolder);
    this.controllersDirectory = path.join(this.appDirectory, 'Controllers');
    this.filtersDirectory = path.join(this.appDirectory, 'Filters');
    this.servicesDirectory = path.join(this.appDirectory, 'Services');
	this.propertiesDirectory = path.join(this.appDirectory, 'Properties');
  },

  createDirectories: function () {
    mkdirp(this.appDirectory);
    mkdirp(this.controllersDirectory);
    mkdirp(this.filtersDirectory);
	mkdirp(this.servicesDirectory);
    mkdirp(this.propertiesDirectory);
  },

  createPropertiesFiles: function () {
    this.fs.copyTpl(
      this.templatePath('api/Properties/_launchSettings.json'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'Properties/launchSettings.json')),
      {
        projectName: this.appData.projectName,
      }
    )
  },

  createControllerFiles: function () {
    this.fs.copyTpl(
      this.templatePath('api/Controllers/_Controller.cs'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'Controllers/Controller.cs')), 
	    {
		  controllerName: this.appData.controllerName,
		  projectName: this.appData.projectName,
		  microserviceDescription: this.appData.microserviceDescription,
		  requestModelName: this.appData.requestModelName,
		  responseModelName: this.appData.responseModelName,
		  authorizationRole: this.appData.authorizationRole,
		}
      );
  },
  
  createServiceFiles: function () {
    this.fs.copyTpl(
      this.templatePath('api/Services/_Service.cs'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'Services/Service.cs')),
      {
        microserviceKey: this.appData.microserviceKey,
		projectName: this.appData.projectName,
		requestModelName: this.appData.requestModelName,
		responseModelName: this.appData.responseModelName,
      }
    )
  },

  createFiltersFiles: function () {
    this.fs.copyTpl(
      this.templatePath('api/Filters/_AddAuthTokenHeaderParameter.cs'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'Filters/AddAuthTokenHeaderParameter.cs')), 
	  {
		  projectName: this.appData.projectName}
      ),
	  this.fs.copyTpl(
      this.templatePath('api/Filters/_ContentTypeOperationFilter.cs'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'Filters/ContentTypeOperationFilter.cs')), 
		{
		  projectName: this.appData.projectName
		}
      )
  },

  createRootFiles: function () {
    this.fs.copyTpl(
      this.templatePath('api/_Startup.cs'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'Startup.cs')), 
		{
			microserviceKey: this.appData.microserviceKey,
			projectName: this.appData.projectName,
		    microserviceDescription: this.appData.microserviceDescription,
			requestModelName: this.appData.requestModelName,
			responseModelName: this.appData.responseModelName
		}
      );
	
	this.fs.copyTpl(
      this.templatePath('api/_Program.cs'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'Program.cs')), 
		{
			projectName: this.appData.projectName
		}
      );	

	this.fs.copyTpl(
      this.templatePath('api/_appsettings.json'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'appsettings.json')), 
		{
			microserviceKey: this.appData.microserviceKey,
			microserviceDescription: this.appData.microserviceDescription,
			release_LoggingDBConnectionString: this.appData.release_LoggingDBConnectionString
		}
      );	
	
	this.fs.copyTpl(
      this.templatePath('api/_appsettings.Development.json'),
      this.destinationPath(path.join(this.appData.applicationFolder, 'appsettings.Development.json')), 
		{
			development_CurrentMicroservicePort: this.appData.development_CurrentMicroservicePort,
			development_CurrentMicroserviceRegistrationName: this.appData.development_CurrentMicroserviceRegistrationName,
			development_LoggingDBConnectionString: this.appData.development_LoggingDBConnectionString
		}
      );

	this.fs.copyTpl(
      this.templatePath('api/_api.csproj.user'),
      this.destinationPath(path.join(this.appData.applicationFolder, this.appData.projectName + '.csproj.user')), 
		{
			projectName: this.appData.projectName
		}
      );	  

	this.fs.copyTpl(
      this.templatePath('api/_api.csproj'),
      this.destinationPath(path.join(this.appData.applicationFolder, this.appData.projectName + '.csproj')), 
		{
			projectName: this.appData.projectName
		}
      );	  
	},

  createOutterFiles: function () {
    this.fs.copyTpl(
      this.templatePath('_solution.sln'),
      this.destinationPath(this.appData.microserviceName + '.sln'),
      {
        projectName: this.appData.projectName,
		projectGuid: this.appData.projectGuid,
		apiProjectGuid: this.appData.apiProjectGuid,
        solutionGuid: this.appData.solutionGuid
      }
    );
	
	this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      {
        microserviceName: this.appData.microserviceName,
		microserviceDescription: this.appData.microserviceDescription
      }
    );
	
	this.fs.copy(
      this.templatePath('_.gitignore'),
      this.destinationPath('.gitignore')
    );
	
	this.fs.copy(
      this.templatePath('_.gitattributes'),
      this.destinationPath('.gitattributes')
    );
  },

  install: function () {
   // this.installDependencies();
  },

  end: function () {
    this.log('\r\n');
    this.log('Your micro-service is now created. Enjoy it!');
    this.log(this.appData.microserviceName);
  }
});

