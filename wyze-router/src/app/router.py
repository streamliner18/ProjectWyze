from multiprocessing import Process
from multiprocessing import cpu_count
from .amq.driver import make_connection
from .amq.pipelines import setup_pipelines
from .amq.processing import mqtt_cb, amqp_cb


class RouterThread(Process):
    def __init__(self, amqp_q, mqtt_q):
        super(RouterThread, self).__init__()
        self.conn, self.ch = None, None
        self.amqp_q = amqp_q
        self.mqtt_q = mqtt_q

    def run(self):
        self.conn, self.ch = make_connection()
        self.ch.basic_consume(mqtt_cb, queue=self.mqtt_q, no_ack=True)
        self.ch.basic_consume(amqp_cb, queue=self.amqp_q, no_ack=True)
        self.ch.start_consuming()

    def terminate(self):
        self.conn.close()


class Router:
    def __init__(self):
        self.conn, self.ch = None, None
        self.mqtt_q, self.amqp_q = '', ''

    def run(self):
        self.conn, self.ch = make_connection()
        self.mqtt_q, self.amqp_q = setup_pipelines(self.ch)
        # Pipeline setup complete, start spawning everything
        threads = [
            RouterThread(self.amqp_q, self.mqtt_q)
            for _ in range(cpu_count())
            ]
        try:
            for i in threads:
                print('Starting thread {}'.format(i.name))
                i.start()
            while True:
                for i in threads:
                    if i.is_alive():
                        i.join(0.5)
                    else:
                        print('{} has died, restarting'.format(i.name))
                        threads.remove(i)
                        new_thr = RouterThread(self.amqp_q, self.mqtt_q)
                        threads.append(new_thr)
                        new_thr.start()
                        new_thr.join(0.5)
        except KeyboardInterrupt:
            for i in threads:
                if i.is_alive():
                    i.terminate()
            self.conn.close()
