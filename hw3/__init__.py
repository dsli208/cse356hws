import pika, sys
from flask import Flask, request, jsonify

app = Flask(__name__)

# connection = None
glob_body = ""
def callback(ch, method, properties, body):
    global glob_body
    glob_body = body
    print(" [x] %r:%r" % (method.routing_key, body))
    ch.close()

@app.route('/', methods=['POST', 'GET'])
def main():
    return "/"

@app.route('/listen', methods=['POST', 'GET'])
def receive_msg():
    global connection
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    channel.exchange_declare(exchange='hw3', exchange_type='direct')
    result = channel.queue_declare(exclusive=True)
    queue_name = result.method.queue
    if request.method == 'POST':
        form = request.json
        binding_keys = form['keys']
        print(binding_keys)

        if not binding_keys:
            sys.stderr.write("binding_keys does not exist")
            sys.exit(1)

        for binding_key in binding_keys:
            channel.queue_bind(exchange='hw3', queue=queue_name, routing_key=binding_key)

        channel.basic_consume(callback, queue=queue_name, no_ack=True)

        channel.start_consuming()
	print("Finished consuming")

        print(' [*] Waiting for logs. To exit press CTRL+C')
	print("Global body" + glob_body)
        return jsonify({"msg": glob_body})

    else:
        connection.close()
        return jsonify({"status":"OK"})

@app.route('/speak', methods=['POST', 'GET'])
def send_message():
    global connection
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    channel.exchange_declare(exchange='hw3', exchange_type='direct')
    result = channel.queue_declare(exclusive=True)
    if request.method == 'POST':
        form = request.json
        print(form)
        if not 'msg' in form:
            return jsonify({"status":"OK"})
        if not 'key' in form:
            return jsonify({"status":"OK"})

        message = form['msg']
        key = form['key']
        print('Message is ' + message + " and key is " + key)
        channel.basic_publish(exchange='hw3', routing_key=key, body=message)
        print(" [x] Sent %r:%r" % (key, message))

    connection.close()

    return jsonify({"status":"OK"})

if __name__ == '__main__':
    app.run(debug=True)
    # ttt_app.run(debug = True, host='0.0.0.0', port=80)
