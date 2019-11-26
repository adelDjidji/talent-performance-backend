from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify

import numpy as np

from statsmodels.tsa.ar_model import AR
from statsmodels.tsa.arima_model import ARMA, ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.holtwinters import SimpleExpSmoothing, ExponentialSmoothing


from random import random

from pprint import pprint

from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
api = Api(app)


class HelloWorld(Resource):
    def get(self, user_id):

        data0=[1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1] #seqencely augmentation
        data1=[1,2,3,3,4,7,15,24,43,67,94] #aumente slowly then fast
        data2=[1,12,23,43,74,89,1,20,23,43,74,89,1,12,23,43,74,89,1,12,23,43,74,89,1,13] #aumente fast
        data_season1=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85]
        data_season2=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85,0,1]
        data_season3=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85,0,1,6,13,23,30,44]
        data_season4=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85,0,1,6,13,23,30,44,44,50,67,72,89]

        data=data_season2
        model = ExponentialSmoothing(data)
        model_fit = model.fit()
        # make prediction
        yhat = model_fit.predict(len(data), len(data))



        data = [x + random() for x in range(1, 10)]
        # fit model
        model = ExponentialSmoothing(data)
        model_fit = model.fit()
        # make prediction
        model_fit.summary()
        yhat = model_fit.predict(len(data), len(data))
        return {'datap':data,'redicted': yhat[0]}







    def post(self, user_id):
        method = request.form['method']
        # donnees = request.form['donnees']
        
        data0=[1,2,3,4,5,1,2,3,4,5,1,2,3,4,5,1] #seqencely augmentation
        data1=[1,2,3,3,4,7,15,24,43,67,94] #aumente slowly then fast
        data2=[1,12,23,43,74,89,1,20,23,43,74,89,1,12,23,43,74,89,1,12,23,43,74,89,1,13] #aumente fast
        data_season1=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85]
        data_season2=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85,0,1]
        data_season3=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85,0,1,6,13,23,30,44]
        data_season4=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85,0,1,6,13,23,30,44,44,50,67,72,89]

        res=[]
        data= data0
        
        for i in range(1,4):
            if(method=="SARIMA"):
                #with seasonal
                model = SARIMAX(data, order=(1, 1, 1), seasonal_order=(1, 1, 1, 1))
                model_fit = model.fit(disp=False)
            if(method=="HWES"):
                #with seasonal
                model = ExponentialSmoothing(data)
                model_fit = model.fit()
            # make prediction
            yhat = model_fit.predict(len(data), len(data))
            data.append(yhat[0])
            res.append(yhat[0])
        obj={ 'prevision':res}
        return obj
class Test2(Resource):
    def get(self):
        return "test"
    def post(self):
        return "yes"

api.add_resource(HelloWorld, '/sa/<int:user_id>')
api.add_resource(Test2, '/test1')


@app.route('/foo', methods=['POST'])
@cross_origin(origin='*',headers=['Content- Type','Authorization'])
def foo():
    return request.form['inputVar']

@app.route('/index')
def index():
    return 'Index Page OK '

@app.route('/sensors')
def sensors():
    list_ = [
        {
      "id": "04418b92-83b4-44d6-a29c-b63c8f0d7c3c",
      "name": "Ch_V_0_DEP-7_094-INS-107",
      "offset": "0|0",
      "data_acquisition_duration": "NA",
      "sampling_rate": "NA",
      "mesurement_polarity": "Unipolarmode",
      "late_acquisition_count": 0,
      "data_acquisition_cycle": 2,
      "unit": "mm",
      "media": []
        },
        {
      "id": "023b92-83b4-a29c-b63c8f0d7c3c",
      "name": "TMP_V_2-7_094-INS-107",
      "offset": "0|0",
      "data_acquisition_duration": "NA",
      "sampling_rate": "NA",
      "mesurement_polarity": "Unipolarmode",
      "late_acquisition_count": 0,
      "data_acquisition_cycle": 3,
      "unit": "°C",
      "media": []
        },
        {
      "id": "023b92-83b4-a29c-b63c8f0d7c3c",
      "name": "CNV_W0-7_094-INS-107",
      "offset": "0|0",
      "data_acquisition_duration": "NA",
      "sampling_rate": "NA",
      "mesurement_polarity": "Unipolarmode",
      "late_acquisition_count": 0,
      "data_acquisition_cycle": 2,
      "unit": "mm",
      "media": []
        }
    ]
    return jsonify(list_)

@app.route('/controllers')
def controllers():
    list_ = [
        {
      "id": "04418b92-83b4-44d6-a29c-b63c8f0d7c3c",
      "name": "Ch_V_0_DEP-7_094-INS-107",
      "offset": "0|0",
      "data_acquisition_duration": "NA",
      "sampling_rate": "NA",
      "mesurement_polarity": "Unipolarmode",
      "late_acquisition_count": 0,
      "data_acquisition_cycle": 2,
      "unit": "mm",
      "media": []
        },
        {
      "id": "023b92-83b4-a29c-b63c8f0d7c3c",
      "name": "TMP_V_2-7_094-INS-107",
      "offset": "0|0",
      "data_acquisition_duration": "NA",
      "sampling_rate": "NA",
      "mesurement_polarity": "Unipolarmode",
      "late_acquisition_count": 0,
      "data_acquisition_cycle": 3,
      "unit": "°C",
      "media": []
        },
        {
      "id": "023b92-83b4-a29c-b63c8f0d7c3c",
      "name": "CNV_W0-7_094-INS-107",
      "offset": "0|0",
      "data_acquisition_duration": "NA",
      "sampling_rate": "NA",
      "mesurement_polarity": "Unipolarmode",
      "late_acquisition_count": 0,
      "data_acquisition_cycle": 2,
      "unit": "mm",
      "media": []
        }
    ]
    return jsonify(list_)

@app.route('/test' , methods=['POST'])
def test():
    req_data = request.get_json()
    data = [3,4,5,6,7,8,9]
    data = req_data['table']
    model = ARMA(data, order=(0, 1))
    model_fit = model.fit(disp=False)
    yhat = model_fit.predict(len(data), len(data))
    return jsonify(yhat[0])

@app.route('/talent', methods=['POST'])
def talent():
    yhat=[-1]
    req_data = request.get_json()
    method= req_data['method']
    data1 = [0,0,4,5,12,22,32,39,43,50,64,77,0,0,5,12,12,14,32,33,45,55,75,0,2,9,19,30,35,48,59,73,77,82,89,0,2,9,9,19,30,48,48,60,69,77,89,0,0,5,12,22,32,43,43,58.70,80,0]
    data=[0,0,6,14,30,41,41,54,66,71,85,89,0,1,4,13,25,32,44,44,62,69,81,85,83,0,2,12]
    res1=[]
    res=[]
    if(method=="SARIMAX"):
        for i in range(1,12):
            model = SARIMAX(data, order=(1, 1, 1), seasonal_order=(1, 1, 1, 1))
            model_fit = model.fit(disp=False)
            # make prediction
            yhat = model_fit.predict(len(data), len(data))
            data= np.append(data,yhat[0])
            res= np.append(res,yhat[0])
    #loop 12 time to predict in eaach time a mounth values so we will predict for all next year,
    #.. verifing the seasonality
    res1= np.append(res1,[0])
    obj={'data':res1}
    # return obj
    return jsonify(obj)

if __name__ == '__main__':
     app.run(debug=True)