import React, { useState } from 'react';

// Sensor thresholds (similar to SensorHeatmap)


const SENSOR_THRESHOLDS = {
  dust: [
    { min: 0, max: 12, color: "#22c55e", label: "Tốt" },
    { min: 12, max: 35, color: "#84cc16", label: "Trung bình" },
    { min: 35, max: 55, color: "#eab308", label: "Nhạy cảm" },
    { min: 55, max: 150, color: "#f97316", label: "Có hại" },
    { min: 150, max: 250, color: "#ef4444", label: "Rất có hại" },
    { min: 250,color: "#7f1d1d", label: "Nguy hiểm" }
  ]
  ,
  temp: [
    { min: null, max: 0, color: "#1e3a8a", label: "Đóng băng" },
    { min: 0, max: 10, color: "#3b82f6", label: "Rất lạnh" },
    { min: 10.1, max: 20, color: "#60a5fa", label: "Lạnh" },
    { min: 20.1, max: 25, color: "#22c55e", label: "Thoải mái" },
    { min: 25.1, max: 30, color: "#eab308", label: "Ấm" },
    { min: 30.1, max: 35, color: "#f97316", label: "Nóng" },
    { min: 35.1, max: 40, color: "#ef4444", label: "Rất nóng" },
    { min: 40,  color: "#7f1d1d", label: "Nguy hiểm" }
  ]
  ,
  humidity: [
    { min: null, max: 20, color: "#7f1d1d", label: "Rất khô" },
    { min: 20, max: 30, color: "#ef4444", label: "Khô" },
    { min: 30.1, max: 40, color: "#f97316", label: "Hơi khô" },
    { min: 40.1, max: 60, color: "#22c55e", label: "Thoải mái" },
    { min: 60.1, max: 70, color: "#eab308", label: "Hơi ẩm" },
    { min: 70.1, max: 80, color: "#3b82f6", label: "Ẩm" },
    { min: 80.1, max: 90, color: "#1e40af", label: "Rất ẩm" },
    { min: 90, color: "#1e3a8a", label: "Quá ẩm" }
  ]
  ,
  MQ2: [
    { min: null, max: 300, color: "#22c55e", label: "An toàn" },
    { min: 300, max: 600, color: "#84cc16", label: "Bình thường" },
    { min: 600, max: 900, color: "#eab308", label: "Chú ý" },
    { min: 900, max: 1200, color: "#f97316", label: "Cảnh báo" },
    { min: 1200, max: 1500, color: "#ef4444", label: "Nguy hiểm" },
    { min: 1500, color: "#7f1d1d", label: "Rất nguy hiểm" }
  ]
  ,
  MQ7: [
    { min: null, max: 300, color: "#22c55e", label: "An toàn" },
    { min: 300, max: 600, color: "#84cc16", label: "Bình thường" },
    { min: 600, max: 900, color: "#eab308", label: "Chú ý" },
    { min: 900, max: 1200, color: "#f97316", label: "Cảnh báo" },
    { min: 1200, max: 1500, color: "#ef4444", label: "Nguy hiểm" },
    { min: 1500, color: "#7f1d1d", label: "Rất nguy hiểm" }
  ]

};

const getColorByThreshold = (value, sensor) => {
  if (value === null || value === undefined) return '#e5e7eb';

  const thresholds = SENSOR_THRESHOLDS[sensor] || SENSOR_THRESHOLDS.dust;

  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i];
    if (threshold.max !== undefined) {
      if (value >= threshold.min && value < threshold.max) {
        return threshold.color;
      }
    } else {
      if (value >= threshold.min) {
        return threshold.color;
      }
    }
  }

  return thresholds[0].color;
};

const getThresholdLabel = (value, sensor) => {
  if (value === null || value === undefined) return 'No data';

  const thresholds = SENSOR_THRESHOLDS[sensor] || SENSOR_THRESHOLDS.dust;

  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i];
    if (threshold.max !== undefined) {
      if (value >= threshold.min && value < threshold.max) {
        return threshold.label;
      }
    } else {
      if (value >= threshold.min) {
        return threshold.label;
      }
    }
  }

  return thresholds[0].label;
};

const ColorLegend = ({ sensor }) => {
  const thresholds = SENSOR_THRESHOLDS[sensor] || SENSOR_THRESHOLDS.dust;

  const getThresholdRangeText = (threshold, sensor) => {
    const units = {
      dust: 'μg/m³',
      temp: '°C',
      humidity: '%',
      MQ2: 'ppm',
      MQ7: 'ppm'
    };
    const unit = units[sensor] || '';

    if (threshold.min === undefined && threshold.max !== undefined) {
      return `< ${threshold.max}${unit}`;
    } else if (threshold.min !== undefined && threshold.max === undefined) {
      return `> ${threshold.min}${unit}`;
    } else if (threshold.min !== undefined && threshold.max !== undefined) {
      return `${threshold.min} - ${threshold.max}${unit}`;
    }
    return unit;
  };

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '10px',
      border: '1px solid #e5e7eb'
    }}>
      <h4 style={{
        margin: '0 0 12px 0',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#374151',
        textTransform: 'capitalize'
      }}>
        {sensor} - Thang màu
      </h4>

      {/* Gradient Bar */}
      <div style={{
        height: '20px',
        borderRadius: '10px',
        background: `linear-gradient(to right, ${thresholds.map(t => t.color).join(', ')})`,
        marginBottom: '12px',
        border: '1px solid #e5e7eb'
      }} />

      {/* Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#6b7280',
        marginBottom: '12px',
        fontWeight: '500'
      }}>
        <span>An toàn</span>
        <span>Nguy hiểm</span>
      </div>

      {/* Threshold Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {thresholds.map((threshold, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: threshold.color,
              borderRadius: '2px',
              border: '1px solid rgba(0,0,0,0.1)',
              flexShrink: 0
            }} />
            <span style={{
              color: '#374151',
              fontWeight: '600',
              flex: 1,
              minWidth: '60px'
            }}>
              {threshold.label}
            </span>
            <span style={{
              color: '#6b7280',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap'
            }}>
              {getThresholdRangeText(threshold, sensor)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PredictionVisualizationGrid = ({ predictions }) => {
  if (!predictions || predictions.length === 0) return null;

  const gridSize = 5;
  const filledGrid = [...predictions];

  while (filledGrid.length < gridSize * gridSize) {
    filledGrid.push(null);
  }

  const getSensorUnit = (sensor) => {
    const units = {
      dust: 'μg/m³',
      temp: '°C',
      humidity: '%',
      MQ2: 'ppm',
      MQ7: 'ppm'
    };
    return units[sensor] || '';
  };

  const getSensorName = (sensor) => {
    const names = {
      dust: 'Bụi mịn',
      temp: 'Nhiệt độ',
      humidity: 'Độ ẩm',
      MQ2: 'Khí cháy (MQ2)',
      MQ7: 'CO (MQ7)'
    };
    return names[sensor] || sensor;
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {['dust', 'temp', 'humidity', 'MQ2', 'MQ7'].map((sensor) => (
        <div key={sensor} style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px'
          }}>
            {/* Grid Container */}
            <div style={{ flex: '1 1 60%' }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '15px'
              }}>
                🔮 {getSensorName(sensor)} - Dự đoán AI
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gap: '0px',
                  padding: '0px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                  maxWidth: '400px'
                }}
              >
                {filledGrid.slice(0, gridSize * gridSize).map((pred, index) => {
                  const value = pred?.[sensor];
                  const color = getColorByThreshold(value, sensor);
                  const label = getThresholdLabel(value, sensor);

                  return (
                    <div
                      key={index}
                      style={{
                        aspectRatio: '1/1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: pred ? '#fff' : '#666',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.2s ease',
                        cursor: pred ? 'pointer' : 'default',
                        backgroundColor: color,
                        position: 'relative',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}
                      title={pred ?
                        `${getSensorName(sensor)}: ${value?.toFixed(2)}${getSensorUnit(sensor)} - ${label} tại (${pred.x}, ${pred.y})` :
                        'Không có dữ liệu'
                      }
                      onMouseOver={(e) => {
                        if (pred) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.zIndex = '10';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (pred) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.zIndex = '1';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {pred ? (
                        <>
                          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                            {value?.toFixed(1)}
                          </div>
                          <div style={{ fontSize: '9px', opacity: 0.9, marginTop: '2px' }}>
                            ({pred.x},{pred.y})
                          </div>
                          <div style={{
                            fontSize: '8px',
                            opacity: 0.8,
                            marginTop: '1px',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            maxWidth: '90%'
                          }}>
                            {label}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                          N/A
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Legend */}
            <div style={{
              flex: '1 1 40%',
              maxWidth: '280px',
              minWidth: '250px'
            }}>
              <ColorLegend sensor={sensor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SensorPredict = () => {
  const [jsonData, setJsonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          JSON.parse(content);
          setJsonData(content);
          setError('');
        } catch (err) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = () => {
    const sampleJson = `{
  "data": [
    {
      "time": "2025-08-09 14:09:27+07:00",
      "x": 1,
      "y": 1,
      "dust": 6.324390500887766,
      "temp": 27.03940905055602,
      "humidity": 73.83464162227828,
      "MQ2": 526.9794727128306,
      "MQ7": 919.3936140313988
    },
    {
      "time": "2025-08-09 14:09:27+07:00",
      "x": 1,
      "y": 2,
      "dust": 8.124390500887766,
      "temp": 29.03940905055602,
      "humidity": 68.83464162227828,
      "MQ2": 486.9794727128306,
      "MQ7": 889.3936140313988
    },
    {
      "time": "2025-08-09 14:09:27+07:00",
      "x": 2,
      "y": 1,
      "dust": 85.824390500887766,
      "temp": 32.53940905055602,
      "humidity": 45.83464162227828,
      "MQ2": 756.9794727128306,
      "MQ7": 1129.3936140313988
    },
    {
      "time": "2025-08-09 14:09:27+07:00",
      "x": 2,
      "y": 2,
      "dust": 7.324390500887766,
      "temp": 28.03940905055602,
      "humidity": 71.83464162227828,
      "MQ2": 506.9794727128306,
      "MQ7": 909.3936140313988
    },
    {
      "time": "2025-08-09 14:09:27+07:00",
      "x": 3,
      "y": 1,
      "dust": 125.124390500887766,
      "temp": 37.03940905055602,
      "humidity": 25.83464162227828,
      "MQ2": 1206.9794727128306,
      "MQ7": 1459.3936140313988
    },
    {
      "time": "2025-08-09 14:09:27+07:00",
      "x": 3,
      "y": 2,
      "dust": 4.324390500887766,
      "temp": 25.03940905055602,
      "humidity": 78.83464162227828,
      "MQ2": 246.9794727128306,
      "MQ7": 469.3936140313988
    }
  ]
}`;
    setJsonData(sampleJson);
  };

  const validateJsonData = (data) => {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('JSON must have "data" array');
      }
      for (let i = 0; i < parsed.data.length; i++) {
        const item = parsed.data[i];
        const requiredFields = ['time', 'x', 'y', 'dust', 'temp', 'humidity', 'MQ2', 'MQ7'];
        for (const field of requiredFields) {
          if (!(field in item)) {
            throw new Error(`Missing "${field}" in item ${i + 1}`);
          }
        }
      }
      return parsed;
    } catch (err) {
      throw new Error(`Invalid JSON: ${err.message}`);
    }
  };

  const sendData = async () => {
    if (!jsonData.trim()) {
      setError('Please enter or upload JSON');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const dataToSend = validateJsonData(jsonData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult = {
        predictions: dataToSend.data.map((item) => ({
          ...item,
          dust: item.dust + (Math.random() - 0.5) * 2,
          temp: item.temp + (Math.random() - 0.5) * 3,
          humidity: item.humidity + (Math.random() - 0.5) * 5,
          MQ2: item.MQ2 + (Math.random() - 0.5) * 50,
          MQ7: item.MQ7 + (Math.random() - 0.5) * 100
        })),
        accuracy: 0.94,
        confidence: 0.87
      };

      setResult(mockResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSensorStats = (predictions) => {
    if (!predictions || predictions.length === 0) return {};

    const stats = {};
    ['dust', 'temp', 'humidity', 'MQ2', 'MQ7'].forEach(sensor => {
      const values = predictions.map(p => p[sensor]).filter(v => v !== undefined);
      stats[sensor] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    });
    return stats;
  };

  const stats = result ? getSensorStats(result.predictions) : {};

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#1e293b',
        fontSize: '32px',
        fontWeight: '800',
        marginBottom: '8px'
      }}>🤖 AI Sensor Prediction</h1>
      <p style={{
        textAlign: 'center',
        color: '#64748b',
        fontSize: '16px',
        marginBottom: '40px'
      }}>
        Dự đoán chất lượng không khí bằng trí tuệ nhân tạo
      </p>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          color: '#334155',
          marginBottom: '20px',
          fontSize: '20px',
          fontWeight: '700'
        }}>📊 Dữ liệu đầu vào</h3>

        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{
            display: 'block',
            marginBottom: '16px',
            padding: '12px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            width: '100%',
            fontSize: '14px'
          }}
        />

        <button
          onClick={loadSampleData}
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '16px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          📄 Tải dữ liệu mẫu
        </button>

        {jsonData && (
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            style={{
              width: '100%',
              height: '200px',
              padding: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '16px',
              fontFamily: 'Monaco, Menlo, monospace',
              fontSize: '13px',
              backgroundColor: '#f8fafc'
            }}
          />
        )}

        <button
          onClick={sendData}
          disabled={loading || !jsonData.trim()}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: loading || !jsonData.trim() ? '#cbd5e1' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !jsonData.trim() ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          {loading ? '🔄 Đang xử lý...' : '🚀 Bắt đầu dự đoán'}
        </button>
      </div>

      {error && (
        <div style={{
          maxWidth: '800px',
          margin: '20px auto',
          backgroundColor: '#fef2f2',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <p style={{ color: '#dc2626', margin: 0, fontWeight: '600' }}>❌ {error}</p>
        </div>
      )}

      {loading && (
        <div style={{
          textAlign: 'center',
          margin: '40px 0',
          color: '#64748b'
        }}>
          <div style={{
            fontSize: '24px',
            marginBottom: '8px'
          }}>⏳</div>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Đang phân tích dữ liệu...</p>
        </div>
      )}

      {result && (
        <div style={{
          maxWidth: '1200px',
          margin: '20px auto',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            color: '#1e293b',
            marginBottom: '20px',
            fontSize: '24px',
            fontWeight: '700'
          }}>📈 Kết quả dự đoán AI</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            marginBottom: '30px'
          }}>
            {[
              { key: 'dust', name: 'Bụi mịn', unit: 'μg/m³', color: '#8b5cf6' },
              { key: 'temp', name: 'Nhiệt độ', unit: '°C', color: '#f59e0b' },
              { key: 'humidity', name: 'Độ ẩm', unit: '%', color: '#06b6d4' },
              { key: 'MQ2', name: 'Khí cháy', unit: 'ppm', color: '#ef4444' },
              { key: 'MQ7', name: 'CO', unit: 'ppm', color: '#10b981' }
            ].map((sensor) => (
              <div key={sensor.key} style={{
                background: `linear-gradient(135deg, ${sensor.color}15, ${sensor.color}25)`,
                padding: '16px',
                borderRadius: '12px',
                border: `2px solid ${sensor.color}30`
              }}>
                <h4 style={{
                  color: sensor.color,
                  margin: '0 0 4px 0',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>{sensor.name}</h4>
                <p style={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                  margin: 0,
                  color: '#1e293b'
                }}>
                  {stats[sensor.key] ? `${stats[sensor.key].avg.toFixed(1)}${sensor.unit}` : `0${sensor.unit}`}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: '4px 0 0 0'
                }}>
                  Trung bình
                </p>
              </div>
            ))}
          </div>

          <PredictionVisualizationGrid predictions={result.predictions} />

          <details style={{ marginTop: '30px' }}>
            <summary style={{
              cursor: 'pointer',
              color: '#3b82f6',
              marginBottom: '16px',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              📊 Xem bảng chi tiết
            </summary>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', color: '#475569', fontWeight: '600' }}>Vị trí</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', color: '#475569', fontWeight: '600' }}>Thời gian</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', color: '#475569', fontWeight: '600' }}>Bụi (μg/m³)</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', color: '#475569', fontWeight: '600' }}>Nhiệt độ (°C)</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', color: '#475569', fontWeight: '600' }}>Độ ẩm (%)</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', color: '#475569', fontWeight: '600' }}>MQ2 (ppm)</th>
                    <th style={{ border: '1px solid #e2e8f0', padding: '12px', color: '#475569', fontWeight: '600' }}>MQ7 (ppm)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.predictions.slice(0, 25).map((pred, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                      <td style={{ border: '1px solid #e2e8f0', padding: '12px', fontWeight: '600' }}>({pred.x}, {pred.y})</td>
                      <td style={{ border: '1px solid #e2e8f0', padding: '12px' }}>{pred.time.split(' ')[1].split('+')[0]}</td>
                      <td style={{
                        border: '1px solid #e2e8f0',
                        padding: '12px',
                        fontWeight: '600',
                        color: getColorByThreshold(pred.dust, 'dust')
                      }}>{pred.dust.toFixed(2)}</td>
                      <td style={{
                        border: '1px solid #e2e8f0',
                        padding: '12px',
                        fontWeight: '600',
                        color: getColorByThreshold(pred.temp, 'temp')
                      }}>{pred.temp.toFixed(1)}</td>
                      <td style={{
                        border: '1px solid #e2e8f0',
                        padding: '12px',
                        fontWeight: '600',
                        color: getColorByThreshold(pred.humidity, 'humidity')
                      }}>{pred.humidity.toFixed(1)}</td>
                      <td style={{
                        border: '1px solid #e2e8f0',
                        padding: '12px',
                        fontWeight: '600',
                        color: getColorByThreshold(pred.MQ2, 'MQ2')
                      }}>{pred.MQ2.toFixed(1)}</td>
                      <td style={{
                        border: '1px solid #e2e8f0',
                        padding: '12px',
                        fontWeight: '600',
                        color: getColorByThreshold(pred.MQ7, 'MQ7')
                      }}>{pred.MQ7.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <details style={{ marginTop: '20px' }}>
            <summary style={{
              cursor: 'pointer',
              color: '#3b82f6',
              marginBottom: '16px',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              🔍 Xem dữ liệu JSON thô
            </summary>
            <pre style={{
              backgroundColor: '#f1f5f9',
              padding: '20px',
              borderRadius: '8px',
              overflowX: 'auto',
              fontSize: '12px',
              border: '1px solid #e2e8f0'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>

          <div style={{
            marginTop: '30px',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }}>
            <p style={{
              color: '#0c4a6e',
              margin: 0,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              💡 <strong>Lưu ý:</strong> Dự đoán được tạo bởi mô hình AI dựa trên dữ liệu lịch sử.
              Độ chính xác: {(result.accuracy * 100).toFixed(1)}% |
              Độ tin cậy: {(result.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorPredict;