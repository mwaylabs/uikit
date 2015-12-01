'use strict';

angular.module('mwFileUpload')

    .service('mwMimetype', function () {

      return {
        application: [
          'application/atom+xml',
          'application/ecmascript',
          'application/EDIFACT',
          'application/json',
          'application/javascript',
          'application/octet-stream',
          'application/ogg',
          'application/pdf',
          'application/postscript',
          'application/rdf+xml',
          'application/rss+xml',
          'application/soap+xml',
          'application/font-woff',
          'application/xhtml+xml',
          'application/xml',
          'application/xml-dtd',
          'application/xop+xml',
          'application/zip',
          'application/*'
        ],

        audio: [
          'audio/basic',
          'audio/L24',
          'audio/mp4',
          'audio/mpeg',
          'audio/ogg',
          'audio/opus',
          'audio/vorbis',
          'audio/vnd.rn-realaudio',
          'audio/vnd.wave',
          'audio/webm',
          'audio/*'
        ],

        image: [
          'image/gif',
          'image/jpg',
          'image/jpeg',
          'image/pjpeg',
          'image/png',
          'image/svg+xml',
          'image/*'
        ],

        video: [
          'video/mpeg',
          'video/mp4',
          'video/ogg',
          'video/quicktime',
          'video/webm',
          'video/x-matroska',
          'video/x-ms-wmv',
          'video/x-flv',
          'video/*'
        ],

        text: [
          'text/cmd',
          'text/css',
          'text/csv',
          'text/html',
          'text/javascript (Obsolete)',
          'text/plain',
          'text/vcard',
          'text/xml',
          'text/*'
        ],

        getMimeTypeGroup: function (mimeType) {
          if (this.text.indexOf(mimeType) !== -1) {
            return 'text';
          } else if (this.video.indexOf(mimeType) !== -1) {
            return 'video';
          } else if (this.image.indexOf(mimeType) !== -1) {
            return 'image';
          } else if (this.audio.indexOf(mimeType) !== -1) {
            return 'audio';
          } else if (this.application.indexOf(mimeType) !== -1) {
            return 'application';
          } else {
            return false;
          }
        },

        checkMimeType: function (is, should) {
          if (is === '*/*' || should === '*/*') {
            return true;
          } else {
            return this.getMimeTypeGroup(is) === this.getMimeTypeGroup(should);
          }
        }
      };

    });