cd api
docker build -t climatelocator_api . 
docker tag climatelocator_api:latest eliseboes/climatelocator_api:0.1.0
docker push eliseboes/climatelocator_api:0.1.0