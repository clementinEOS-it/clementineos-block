$(function() {

    'use strict';

    var data = {
      actions: {},
      msgsuccess: '',
      msgwarning: ''
    };

    new Vue({
      el: '#app',
      data: data
    });

    var test = true;
    var url_covid, url_agrimarket;

    if (test) {
        url_covid = 'http://localhost:3001/';
        url_agrimarket = 'http://localhost:3003/';
    } else {
        url_covid = 'http://coronavirus.clementineos.it';
        url_agrimarket = 'http://agrimarket.clementineos.it';
    };

    var socket_covid = io(url_covid);
    var socket_agrimarket = io(url_agrimarket);

    var lineArr = [];
    var duration = 2000;

    var wl = $("#chart").outerWidth();
    var chartLine = realTimeLineChart(wl, 500, duration);

    let receive_data = (_data) => {

        var _d = JSON.parse(_data);
        updateLine(_d.block_time, _d.receipt.cpu_usage_us, _d.net_usage);
        data.actions = _d.action_traces

      /*

       { 
         "id":"1338e5b7cc21026045952c685be2c38cfbcbc1a69023cfe9e520ae775954ee98",
         "block_num":1305647,
         "block_time":"2020-04-30T18:07:08.000",
         "producer_block_id":null,
         "receipt":{
           "status":"executed",
           "cpu_usage_us":321,
           "net_usage_words":34
          },
          "elapsed":321,
          "net_usage":272,
          "scheduled":false,
          "action_traces":[{
              "action_ordinal":1,
              "creator_action_ordinal":0,
              "closest_unnotified_ancestor_action_ordinal":0,
              "receipt":{
                "receiver":"gqeaceafdbkq",
                "act_digest":"aae8483f7aff7e486cc16ee482e173c9f1a146355b698d2c35b95d1e8e53215a",
                "global_sequence":1355168,
                "recv_sequence":20498,
                "auth_sequence":[["gqeaceafdbkq",20601]],
                "code_sequence":28,
                "abi_sequence":28
              },
              "receiver":"gqeaceafdbkq",
              "act":{
                "account":"gqeaceafdbkq",
                "name":"send",
                "authorization":[{"actor":"gqeaceafdbkq","permission":"active"}],
                "data":{
                  "dateISO":"2020-02-24",
                  "key":"117b870a5cd8f75a789c54a318c6dbcf5fafd33bc6ee41159d3715e7757ca49b",
                  "source_hash":"c9298ef6841a54fb569f8e55e05e9ff7e7c34853213735981264fb02cb31a78a",
                  "lat":"45.07327449999999658",
                  "lng":"7.68068748299999982",
                  "hws":2,"ic":0,"to":2,"hi":1,"tot_cp":3,"tot_new_cp":0,"dh":0,"dead":0,"tot_c":3,"sw":141,"tc":0
                },
                "hex_data":"0a323032302d30322d3234117b870a5cd8f75a789c54a318c6dbcf5fafd33bc6ee41159d3715e7757ca49bc9298ef6841a54fb569f8e55e05e9ff7e7c34853213735981264fb02cb31a78abc900e0f618946405020b92306b91e400200000000000000000000000000000002000000000000000100000000000000030000000000000000000000000000000000000000000000000000000000000003000000000000008d000000000000000000000000000000"
              },
              "context_free":false,
              "elapsed":169,
              "console":"",
              "trx_id":"1338e5b7cc21026045952c685be2c38cfbcbc1a69023cfe9e520ae775954ee98",
              "block_num":1305647,
              "block_time":"2020-04-30T18:07:08.000",
              "producer_block_id":null,
              "account_ram_deltas":[],
              "except":null,
              "error_code":null,
              "inline_traces":[]
            }],
          "account_ram_delta":null,
          "except":null,
          "error_code":null
        }

      */

    };

    socket_covid.on('block', (_data) => {
      // console.log('CLIENT BLOCK block -> ' + _data);
      receive_data(_data);
    });

    socket_agrimarket.on('block', (_data) => {
        // console.log('CLIENT BLOCK block -> ' + _data);
        receive_data(_data);
      });

    socket_covid.on('update', _data => {
        console.log('CLIENT BLOCK update -> ' + _data);
        data.msgsuccess = _data;
    });

    socket_covid.on('error', _data => {
        console.log('CLIENT BLOCK error -> ' + _data);
        data.msgwarning = _data;
    });

    socket_agrimarket.on('update', _data => {
        console.log('CLIENT BLOCK update -> ' + _data);
        data.msgsuccess = _data;
    });
  
    socket_agrimarket.on('error', _data => {
        console.log('CLIENT BLOCK error -> ' + _data);
        data.msgwarning = _data;
    });

    let updateLine = (date, cpu, net) => {

      var now = new Date(date);

      var lineData = {
        time: now,
        cpu: cpu,
        net: net
      };

      lineArr.push(lineData);

      if (lineArr.length > 30) {
        lineArr.shift();
      }

      d3.select("#chart").datum(lineArr).call(chartLine);

    };

});