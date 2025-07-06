const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // Library
    const lib_mod = b.createModule(.{
        .root_source_file = b.path("lib/lib.zig"),
        .target = target,
        .optimize = optimize,
    });

    const lib = b.addLibrary(.{
        .linkage = .static,
        .name = "207f",
        .root_module = lib_mod,
    });

    b.installArtifact(lib);

    // Wasm
    const target_wasm = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });

    const lib_mod_wasm = b.createModule(.{
        .root_source_file = b.path("lib/lib.zig"),
        .target = target_wasm,
        .optimize = .ReleaseSmall,
    });

    const lib_wasm = b.addExecutable(.{
        .name = "207f",
        .root_module = lib_mod_wasm,
    });
    lib_wasm.entry = .disabled;
    lib_wasm.rdynamic = true;

    b.installArtifact(lib_wasm);

    // const install_to_www = b.addInstallFileWithDir(
    //     lib_wasm.getEmittedBin(),
    //     .{ .custom = "../" },
    //     "207f.wasm",
    // );
    // b.getInstallStep().dependOn(&install_to_www.step);

    // CLI
    const exe_mod = b.createModule(.{
        .root_source_file = b.path("cli/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    exe_mod.addImport("207f", lib_mod);

    const exe = b.addExecutable(.{
        .name = "207f",
        .root_module = exe_mod,
    });

    b.installArtifact(exe);

    // zig build run
    const run_cmd = b.addRunArtifact(exe);

    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    // Testing
    const test_step = b.step("test", "Run unit tests");

    const lib_unit_tests = b.addTest(.{
        .root_module = lib_mod,
    });
    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);
    test_step.dependOn(&run_lib_unit_tests.step);

    const exe_unit_tests = b.addTest(.{
        .root_module = exe_mod,
    });
    const run_exe_unit_tests = b.addRunArtifact(exe_unit_tests);
    test_step.dependOn(&run_exe_unit_tests.step);
}
