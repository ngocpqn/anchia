export function renderDashboard(){

  // reset DOM sạch
  document.getElementById("app").innerHTML = ""

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]")

  let totalMoney = 0
  sessions.forEach(s => totalMoney += s.total)

  document.getElementById("app").innerHTML = `
  <div class="wrapper">

    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu">
            <i class="fas fa-bars"></i>
          </a>
        </li>
        <li class="nav-item">
          <span class="nav-link">Trang chủ</span>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <i class="fas fa-bell nav-link"></i>
        </li>
        <li class="nav-item">
          <i class="fas fa-user nav-link"></i>
        </li>
      </ul>
    </nav>

    <!-- Sidebar -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">

      <a class="brand-link">
        <span class="brand-text font-weight-light">Admin Panel</span>
      </a>

      <div class="sidebar">

        <div class="user-panel mt-3 pb-3 mb-3">
          <div class="info">
            <a class="d-block">Administrator</a>
          </div>
        </div>

        <nav>
          <ul class="nav nav-pills nav-sidebar flex-column">

            <li class="nav-item">
              <a class="nav-link active">
                <i class="nav-icon fas fa-chart-pie"></i>
                <p>Dashboard</p>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link">
                <i class="nav-icon fas fa-users"></i>
                <p>Người dùng</p>
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" id="backHome">
                <i class="nav-icon fas fa-home"></i>
                <p>Về trang chính</p>
              </a>
            </li>

          </ul>
        </nav>

      </div>
    </aside>

    <!-- Content -->
    <div class="content-wrapper">

      <section class="content-header">
        <div class="container-fluid">
          <h1>Dashboard</h1>
        </div>
      </section>

      <section class="content">
        <div class="container-fluid">

          <div class="row">

            <div class="col-lg-3 col-6">
              <div class="small-box bg-info">
                <div class="inner">
                  <h3>${sessions.length}</h3>
                  <p>Đơn hàng mới</p>
                </div>
              </div>
            </div>

            <div class="col-lg-3 col-6">
              <div class="small-box bg-success">
                <div class="inner">
                  <h3>53%</h3>
                  <p>Tăng trưởng</p>
                </div>
              </div>
            </div>

            <div class="col-lg-3 col-6">
              <div class="small-box bg-warning">
                <div class="inner">
                  <h3>${sessions.length}</h3>
                  <p>Người dùng</p>
                </div>
              </div>
            </div>

            <div class="col-lg-3 col-6">
              <div class="small-box bg-danger">
                <div class="inner">
                  <h3>${totalMoney.toLocaleString()}</h3>
                  <p>Doanh thu</p>
                </div>
              </div>
            </div>

          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Doanh thu</h3>
            </div>
            <div class="card-body">
              <canvas id="chart"></canvas>
            </div>
          </div>

        </div>
      </section>

    </div>

  </div>
  `

  // back button
  document.getElementById("backHome").onclick = () => {
    window.location = "/"
  }

  // chart
  const ctx = document.getElementById('chart')

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['T1','T2','T3','T4','T5'],
      datasets: [{
        label: 'Doanh thu',
        data: [100,200,150,300,250],
        borderWidth: 2
      }]
    }
  })
}