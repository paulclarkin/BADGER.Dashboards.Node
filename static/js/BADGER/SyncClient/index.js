(function() {
    'use strict';

    TLRGRP.namespace('TLRGRP.BADGER.SyncClient');

    TLRGRP.BADGER.SyncClient =  function() {
        var socket = io.connect();
        var sessionId;
        var sessionName = $.cookie('boardName');
        var identifyTimeout;

        function setIdentityDiv() {
            $('#identify').text(sessionName);
        }

        setIdentityDiv();

        var commands = {
            reload: function() {
                window.location = window.location;
            },
            setName: function(data) {
                sessionName = data.name;
                $.cookie('boardName', sessionName, { expires: 365 });
                setIdentityDiv();
            },
            identify: function() {
                clearTimeout(identifyTimeout);
                $('#identify').removeClass('hidden');
                identifyTimeout = setTimeout(function() {
                    $('#identify').addClass('hidden');
                }, 5000);
            }
        };

        socket.on('connectionHandshake', function(connectionDetails) {
            sessionId = connectionDetails.sessionId;

            socket.emit('nameConnection', {
                name: sessionName || sessionId
            });
        });

        socket.on('clientCommand', function(commandDetails) {
            commands[commandDetails.command](commandDetails.data);
        });
    };
})();