'use strict';

angular.module('workspaceApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ng',
  'pascalprecht.translate'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .config(['$translateProvider', function ($translateProvider) {

    // Simply register translation table as object hash
    $translateProvider.translations('en', {
      'LOGIN': {
        'LOGIN': 'Login'
      },
      'LOGOUT': 'Logout',
      'TWITTER': {
        'CONNECT': 'Connect with Twitter'
      },
      'SIGNUP': {
        'SIGNUP': 'Signup',
        'NAME': 'Name',
        'NAME_REQUIRED': 'A name is required.',
        'EMAIL': 'Email',
        'EMAIL_INVALID': 'Doesn\'t look like a valid email.',
        'EMAIL_REQUIRED': 'What\'s your email address?',
      },
      'REGISTER': 'Register',
      'TRENDING': 'Trending',
      'POLL': 'Poll',
      'POLL_NEW': 'New Poll',
      'POLL_MY': 'My Poll',
      'POLLS': 'Polls',
      'QUESTION': 'Question',
      'MAIN': {
        'ASK_SHARE': 'Ask questions, share results.',
        'OR': 'or',
        'INSTANT': 'Instant results!',
        'EVERYONE': 'Available for everyone!',
        'FREE': 'Free forever!'
      },
      'SAVE_CHANGES': 'Save changes',
      'SETTINGS': {
        'PASSWORD_CHANGE': 'Change password',
        'PASSWORD_CURRENT': 'Current password',
        'PASSWORD_NEW': 'New Password',
        'PASSWORD_MINLENGTH': 'Password must be at least 3 characters.',
      }
    });
    $translateProvider.translations('es', {
      'LOGIN': {
        'LOGIN': 'Iniciar Sesión'
      },
      'LOGOUT': 'Cerrar Sesión',
      'TWITTER': {
        'CONNECT': 'Conectate con Twitter'
      },
      'SIGNUP': {
        'SIGNUP': 'Registrarse',
        'NAME': 'Nombre',
        'NAME_REQUIRED': 'Un nombre es requerido.',
        'EMAIL': 'Correo electrónico',
        'EMAIL_INVALID': 'No se ve como una dirección válida.',
        'EMAIL_REQUIRED': 'Cual es tu dirección de correo?',
      },
      'REGISTER': 'Registrarse',
      'TRENDING': 'Tendencias',
      'POLL': 'Encuesta',
      'POLL_NEW': 'Nueva encuesta',
      'POLL_MY': 'Mis encuestras',
      'POLLS': 'Encuestas',
      'QUESTION': 'Pregunta',
      'OPTION': 'Opción',
      'MAIN': {
        'ASK_SHARE': 'Haz preguntas, comparte resultados.',
        'OR': 'o',
        'INSTANT': 'Resultados instantaneos!',
        'EVERYONE': 'Disponible para todos!',
        'FREE': 'Gratis para siempre!'
      },
      'SAVE_CHANGES': 'Guardar cambios',
      'SETTINGS': {
        'PASSWORD_CHANGE': 'Cambiar contraseña',
        'PASSWORD_CURRENT': 'Contraseña actual',
        'PASSWORD_NEW': 'Contraseña nueva',
        'PASSWORD_MINLENGTH': 'La contraseña debe tener al menos 3 caracteres.',
      }
    }).registerAvailableLanguageKeys(['en', 'es'], {
      'en_US': 'en',
      'en_UK': 'en',
      'es_ES': 'es',
      'es_PY': 'es',
      'es_MX': 'es',
      'es_AR': 'es'
    })
      .fallbackLanguage('en');;


    $translateProvider
      .determinePreferredLanguage();
  }])

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          if(!window.next)
            window.next = $location.$$path;
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
