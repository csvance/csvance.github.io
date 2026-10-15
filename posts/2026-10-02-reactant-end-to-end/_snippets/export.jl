ReactantNitro.export_inputs(::PathMNIST) = [ExportSpec("img", UInt8, [224, 224, 3, 1])]
ReactantNitro.export_outputs(::PathMNIST) = [ExportSpec("logits")]
