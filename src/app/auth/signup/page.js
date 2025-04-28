"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Loader from "@/components/utlis/Loader";
import { useAppDispatch } from "@/redux/hooks";
import { setUserLogin } from "@/redux/slicers/userSlice";
import { 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  FileText,
  User,
  Building,
  Search,
  Plus
} from "lucide-react";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupType, setSignupType] = useState("user"); // "user" or "company"
  const [companyOption, setCompanyOption] = useState("join"); // "join" or "create"
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyEmail: "",
    role: "employee" // Default role for users joining a company
  });
  
  const [step, setStep] = useState(1); // 1: Type Selection, 2: Account Info, 3: Company Details (if applicable)
  const router = useRouter();

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
          setFilteredCompanies(data);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    if (signupType === "user" && companyOption === "join") {
      fetchCompanies();
    }
  }, [signupType, companyOption]);

  // Filter companies based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAccountInfo = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required");
      return false;
    }
    
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const validateCompanyDetails = () => {
    if (signupType === "company") {
      if (!formData.companyName) {
        setError("Company name is required");
        return false;
      }
      
      if (!formData.companyEmail) {
        setError("Company email is required");
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.companyEmail)) {
        setError("Please enter a valid company email address");
        return false;
      }
    } else if (signupType === "user" && companyOption === "join") {
      if (!selectedCompany) {
        setError("Please select a company to join");
        return false;
      }
    }
    
    return true;
  };

  const goToNextStep = () => {
    if (step === 1) {
      setError("");
      setStep(2);
    } else if (step === 2 && validateAccountInfo()) {
      setError("");
      // If user is creating/joining a company, go to step 3
      if (signupType === "company" || (signupType === "user" && companyOption === "join")) {
        setStep(3);
      } else {
        // Otherwise, submit the form
        handleSubmit();
      }
    } else if (step === 3 && validateCompanyDetails()) {
      setError("");
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    
    try {
      let endpoint = '';
      let payload = {};

      if (signupType === "company") {
        endpoint = '/api/companies/register';
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          companyEmail: formData.companyEmail,
          role: 'admin' // Company creator is admin
        };
      } else if (signupType === "user" && companyOption === "join") {
        endpoint = '/api/users/signup';
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          companyId: selectedCompany._id,
          role: formData.role
        };
      } else {
        // Regular user without company
        endpoint = '/api/users/register';
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setLoading(false);
        dispatch(setUserLogin(true));
        toast.success("Account created successfully!");
        router.push("/services"); // Redirect to services page after signup
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create account. Please try again.");
        toast.error('Registration failed');
        setLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration error. Please try again.");
      toast.error("Registration failed");
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    // For company signup or user joining company, we have 3 steps
    const totalSteps = (signupType === "company" || (signupType === "user" && companyOption === "join")) ? 3 : 2;
    
    return (
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          {totalSteps === 3 && (
            <>
              <div className={`w-12 h-1 ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderTypeSelection = () => {
    return (
      <>
        <h3 className="text-xl font-semibold mb-6 text-center">Select Account Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            className={`flex flex-col items-center p-6 border-2 rounded-lg ${
              signupType === "user" 
                ? "border-black bg-gray-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSignupType("user")}
          >
            <User className={`h-12 w-12 mb-4 ${signupType === "user" ? "text-black" : "text-gray-400"}`} />
            <h4 className="text-lg font-medium">Individual User</h4>
            <p className="text-sm text-gray-500 text-center mt-2">
              Create an account to manage your personal documents
            </p>
          </button>

          <button
            type="button"
            className={`flex flex-col items-center p-6 border-2 rounded-lg ${
              signupType === "company" 
                ? "border-black bg-gray-50" 
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSignupType("company")}
          >
            <Building className={`h-12 w-12 mb-4 ${signupType === "company" ? "text-black" : "text-gray-400"}`} />
            <h4 className="text-lg font-medium">Company</h4>
            <p className="text-sm text-gray-500 text-center mt-2">
              Create a company account to manage documents for your organization
            </p>
          </button>
        </div>

        {signupType === "user" && (
          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Company Affiliation</h4>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="join-company"
                  name="company-option"
                  checked={companyOption === "join"}
                  onChange={() => setCompanyOption("join")}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="join-company" className="ml-2 block text-sm text-gray-700">
                  Join an existing company
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no-company"
                  name="company-option"
                  checked={companyOption === "none"}
                  onChange={() => setCompanyOption("none")}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <label htmlFor="no-company" className="ml-2 block text-sm text-gray-700">
                  No company affiliation
                </label>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderAccountInfo = () => {
    return (
      <>
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters long
            </p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>
      </>
    );
  };

  const renderCompanyDetails = () => {
    if (signupType === "company") {
      // Company creation form
      return (
        <>
          <h3 className="text-xl font-semibold mb-4">Company Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Company Email
              </label>
              <input
                type="email"
                id="companyEmail"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="contact@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  As a company admin, you'll be able to manage users, document permissions, and company settings.
                </p>
              </div>
            </div>
          </div>
        </>
      );
    } else if (signupType === "user" && companyOption === "join") {
      // Company selection form
      return (
        <>
          <h3 className="text-xl font-semibold mb-4">Select Your Company</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="company-search" className="block text-sm font-medium text-gray-700 mb-1">
                Search for your company
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="company-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search companies..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {filteredCompanies.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredCompanies.map((company) => (
                      <li key={company._id}>
                        <button
                          type="button"
                          className={`w-full px-4 py-3 flex items-center text-left hover:bg-gray-50 ${
                            selectedCompany?._id === company._id ? 'bg-gray-50' : ''
                          }`}
                          onClick={() => setSelectedCompany(company)}
                        >
                          <div className="bg-gray-200 rounded-full p-2 mr-3">
                            <Building className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">{company.name}</h4>
                            <p className="text-sm text-gray-500">{company.email}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? "No companies found matching your search" : "No companies available"}
                  </div>
                )}
              </div>
            </div>
            
            {selectedCompany && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Selected Company: {selectedCompany.name}</h4>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="legal">Legal Staff</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              <p>Can't find your company? <Link href="/contact" className="text-black font-medium">Contact us</Link> or ask your company administrator to send you an invitation.</p>
            </div>
          </div>
        </>
      );
    }
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return renderTypeSelection();
      case 2:
        return renderAccountInfo();
      case 3:
        return renderCompanyDetails();
      default:
        return null;
    }
  };

  // Determine the step title based on the current step and signup type
  const getStepTitle = () => {
    if (step === 1) return "Create Your Account";
    if (step === 2) return "Account Information";
    if (step === 3) {
      if (signupType === "company") return "Company Details";
      if (signupType === "user" && companyOption === "join") return "Join Company";
    }
    return "Sign Up";
  };

  // Determine how many steps there are based on the signup type
  const getTotalSteps = () => {
    if (signupType === "company" || (signupType === "user" && companyOption === "join")) {
      return 3;
    }
    return 2;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with logo */}
      <header className="bg-black py-4">
        <div className="container mx-auto px-6">
          <Link href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-white mr-2" />
            <span className="text-xl font-bold text-white">ChainVault</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Column - Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex md:w-1/2 bg-black text-white p-8 justify-center items-center"
        >
          <div className="max-w-md px-6 py-10 flex flex-col items-center text-center">
            <FileText className="h-16 w-16 mb-6" />
            <h1 className="text-4xl font-bold mb-6">Join Chain Vault</h1>
            <p className="text-xl mb-8">
              Create an account to securely store, manage, and share your important legal documents with blockchain verification.
            </p>
            
            <div className="w-full bg-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Benefits of Chain Vault</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Military-grade encryption for all your documents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Blockchain verification ensures tamper-proof storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Granular access control with smart contracts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Complete audit trail for all document activity</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Sign Up Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 px-6 py-10 flex items-center justify-center"
        >
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{getStepTitle()}</h2>
              <p className="text-gray-600">Step {step} of {getTotalSteps()}</p>
            </div>

            {renderStepIndicator()}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }} className="space-y-6">
              {renderFormStep()}

              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-md flex items-center hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  {step === getTotalSteps() ? "Sign Up" : "Next"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-black font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {loading && <Loader />}
    </div>
  )
}
export default SignUp;