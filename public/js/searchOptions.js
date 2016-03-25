
var SearchOptions = Immutable.Map({
			
				bedOptions 			: Immutable.List.of(
										    { value: '1',  label: '1'  },
										    { value: '2',  label: '2'  },
										    { value: '3',  label: '3'  },
										    { value: '4',  label: '4'  },
										    { value: '5',  label: '5'  },
										    { value: '6',  label: '6'  },
										    { value: '7',  label: '7'  },
										    { value: '8',  label: '8'  },
										    { value: '9',  label: '9'  },
										    { value: '10', label: '10' },
										    { value: '11', label: '11' },
										    { value: '12', label: '12' },
										    { value: '13', label: '13' },
										    { value: '14', label: '14' },
										    { value: '15', label: '15' }
									),

				bathOptions			: Immutable.List.of(
										    { value: '1', label: '1' },
										    { value: '2', label: '2' },
										    { value: '3', label: '3' },
										    { value: '4', label: '4' }
									),
				minValue 			: Immutable.List.of(
										    { value: '100', 		label: '100' 		},
										    { value: '500', 		label: '500' 		},
										    { value: '1000', 		label: '1000' 		},
										    { value: '10000', 		label: '10000' 		},
										    { value: '100000', 		label: '100000' 	},
										    { value: '1000000', 	label: '1000000' 	},
										    { value: '10000000', 	label: '10000000' 	},
										    { value: '20000000', 	label: '20000000' 	}
										),
				maxValue 			: Immutable.List.of(
   	   										{ value: '100', 		label: '100' 		},
										    { value: '500', 		label: '500' 		},
										    { value: '1000', 		label: '1000' 		},
										    { value: '10000', 		label: '10000' 		},
										    { value: '100000', 		label: '100000' 	},
										    { value: '1000000', 	label: '1000000' 	},
										    { value: '10000000', 	label: '10000000' 	},
										    { value: '20000000', 	label: '20000000' 	}
										),
				currencies 			: Immutable.List.of(
				    						{ value: 'GBP', label: 'GBP' },
    										{ value: 'USD', label: 'USD' },
    										{ value: 'EUR', label: 'EUR' }
										)
				});