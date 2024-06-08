// package com.ensaj.service;

// import org.springframework.stereotype.Service;
// import org.tensorflow.SavedModelBundle;
// import org.tensorflow.Session;
// import org.tensorflow.Tensor;

// @Service
// public class TensorFlowService {

//     private final String modelPath = "path/to/your/tensorflow/model"; // Update with the actual path

//     public float[] predictImage(byte[] imageData) {
//         try (SavedModelBundle model = SavedModelBundle.load(modelPath, "serve")) {
//             Session.Runner runner = model.session().runner();

//             // Replace "input_image" with the actual input node name
//             Tensor<byte[]> inputTensor = Tensor.create(imageData, byte[].class);
//             runner.feed("input_image", inputTensor);

//             // Replace "output_predictions" with the actual output node name
//             Tensor<Float> outputTensor = runner.fetch("output_predictions");

//             float[] predictions = new float[(int) outputTensor.shape()[1]];
//             outputTensor.copyTo(predictions);
//             return predictions;
//         } catch (Exception e) {
//             throw new RuntimeException("Error loading or running the TensorFlow model.", e);
//         }
//     }
// }
